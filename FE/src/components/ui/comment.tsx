"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  Space,
  Tooltip,
  Typography,
  Rate,
  App,
  Alert,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  LoginOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { TextArea } = Input;
const { Text } = Typography;
const DEFAULT_AVATAR = "/images/logos/GZ.png";

type CommentItem = {
  _id?: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  rating?: number;
  likes: number;
  dislikes: number;
  action: "liked" | "disliked" | null;
};

type UsersCommentProps = {
  productId: string;
  accessToken?: string;
  apiBase?: string;
  currentUser?: { name: string; avatar?: string };
  placeholder?: string;
  submitText?: string;
};

// Chuẩn hóa avatar: bỏ "", "null", "undefined", khoảng trắng
const normalizeAvatar = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined")
    return undefined;
  return trimmed;
};

const UsersComment: React.FC<UsersCommentProps> = ({
  productId,
  accessToken,
  apiBase,
  currentUser = { name: "Bạn", avatar: "" },
  placeholder = "Nhập bình luận của bạn...",
  submitText = "Gửi đánh giá",
}) => {
  const { message } = App.useApp();

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [value, setValue] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const baseUrl =
    apiBase ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://next-nest-ecommerce.onrender.com/api/v1";

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) h.Authorization = `Bearer ${accessToken}`;
    return h;
  }, [accessToken]);

  // ===== GET reviews =====
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/reviews?productId=${productId}&page=1&limit=20&sort=recent`,
        { headers }
      );
      const d = await res.json();

      const items = (d?.items || d?.data?.items || []).map((r: any) => ({
        _id: r._id,
        author: r.createdBy?.email || r.userId?.email || "Ẩn danh",
        avatar: normalizeAvatar(r.userId?.avatar),
        content: r.comment || "",
        rating: r.rating || 0,
        createdAt: r.createdAt || new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        action: null,
      })) as CommentItem[];

      setComments(items);
    } catch (e) {
      message.error("Không tải được bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, baseUrl]);

  // ===== POST review =====
  const handleSubmit = async () => {
    if (!accessToken) {
      message.warning("Vui lòng đăng nhập để gửi bình luận!");
      return;
    }

    const trimmed = value.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId,
          rating,
          comment: trimmed,
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d?.message || "Gửi đánh giá thất bại");

      message.success("Đã gửi đánh giá!");
      setValue("");
      setRating(5);
      await fetchReviews(); // refetch để đồng bộ dữ liệu mới
    } catch (e: any) {
      message.error(e?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Like/Dislike local =====
  const handleLike = (idx: number) => {
    setComments((prev) =>
      prev.map((c, i) => {
        if (i !== idx) return c;
        if (c.action === "liked")
          return { ...c, likes: Math.max(0, c.likes - 1), action: null };
        return {
          ...c,
          likes: c.likes + 1,
          dislikes:
            c.action === "disliked" ? Math.max(0, c.dislikes - 1) : c.dislikes,
          action: "liked",
        };
      })
    );
  };

  const handleDislike = (idx: number) => {
    setComments((prev) =>
      prev.map((c, i) => {
        if (i !== idx) return c;
        if (c.action === "disliked")
          return { ...c, dislikes: Math.max(0, c.dislikes - 1), action: null };
        return {
          ...c,
          dislikes: c.dislikes + 1,
          likes: c.action === "liked" ? Math.max(0, c.likes - 1) : c.likes,
          action: "disliked",
        };
      })
    );
  };

  const currentUserAvatar = normalizeAvatar(currentUser.avatar);
  const currentUserInitial =
    currentUser.name?.trim()?.charAt(0)?.toUpperCase() || "B";


    ///

    return (
      <div className="gzx-review-wrap">
        {/* Header */}
        <div className="gzx-review-head">
          <div>
            <h3 className="gzx-review-title">Đánh giá & bình luận</h3>
            <p className="gzx-review-subtitle">
              Chia sẻ cảm nhận của bạn về sản phẩm này
            </p>
          </div>
    
          <div className="gzx-review-count">
            {comments.length} bình luận
          </div>
        </div>
    
        {/* Danh sách bình luận */}
        <List
          className="gzx-review-list"
          loading={loading}
          dataSource={comments}
          locale={{
            emptyText: (
              <div className="gzx-empty-box">
                <div className="gzx-empty-icon">💬</div>
                <div className="gzx-empty-title">Chưa có bình luận nào</div>
                <div className="gzx-empty-text">
                  Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này.
                </div>
              </div>
            ),
          }}
          itemLayout="horizontal"
          renderItem={(item, idx) => {
            const avatarSrc = normalizeAvatar(item.avatar);
            const initial = item.author?.trim()?.charAt(0)?.toUpperCase() || "A";
    
            return (
              <div
                key={item._id || `${item.author}-${idx}`}
                className="gzx-comment-card"
              >
                <Avatar
                  src={avatarSrc || "/images/logos/GZ.png"}
                  className="gzx-comment-avatar"
                >
                  {!avatarSrc ? initial : null}
                </Avatar>
    
                <div className="gzx-comment-main">
                  <div className="gzx-comment-top">
                    <div className="gzx-comment-user">
                      <Text strong className="gzx-comment-author">
                        {item.author}
                      </Text>
    
                      {item.rating ? (
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          className="gzx-comment-rate"
                        />
                      ) : null}
                    </div>
    
                    <Text className="gzx-comment-time">
                      {dayjs(item.createdAt).fromNow()}
                    </Text>
                  </div>
    
                  <p className="gzx-comment-text">{item.content}</p>
    
                  <div className="gzx-comment-actions">
                    <Tooltip title="Like">
                      <button
                        type="button"
                        onClick={() => handleLike(idx)}
                        className={`gzx-action-pill ${
                          item.action === "liked" ? "liked" : ""
                        }`}
                      >
                        {item.action === "liked" ? <LikeFilled /> : <LikeOutlined />}
                        <span>{item.likes}</span>
                      </button>
                    </Tooltip>
    
                    <Tooltip title="Dislike">
                      <button
                        type="button"
                        onClick={() => handleDislike(idx)}
                        className={`gzx-action-pill ${
                          item.action === "disliked" ? "disliked" : ""
                        }`}
                      >
                        {item.action === "disliked" ? (
                          <DislikeFilled />
                        ) : (
                          <DislikeOutlined />
                        )}
                        <span>{item.dislikes}</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          }}
        />
    
        {/* Form nhập đánh giá */}
        <div className="gzx-form-box">
          <div className="gzx-form-left">
            <Avatar
              src={currentUserAvatar || "/images/logos/GZ.png"}
              className="gzx-comment-avatar"
            >
              {!currentUserAvatar ? currentUserInitial : null}
            </Avatar>
          </div>
    
          <div className="gzx-form-right">
            {!accessToken ? (
              <Alert
                type="warning"
                showIcon
                className="gzx-login-alert"
                message={
                  <Space>
                    <LoginOutlined />
                    <span>
                      Vui lòng{" "}
                      <a href="/auth/signin" className="gzx-login-link">
                        đăng nhập
                      </a>{" "}
                      để gửi đánh giá.
                    </span>
                  </Space>
                }
              />
            ) : (
              <Form onFinish={handleSubmit} className="gzx-review-form">
                <div className="gzx-form-header">
                  <Text className="gzx-form-title">Đánh giá của bạn</Text>
                  <Rate
                    value={rating}
                    onChange={setRating}
                    className="gzx-form-rate"
                  />
                </div>
    
                <Form.Item style={{ marginBottom: 12 }}>
                  <TextArea
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="gzx-comment-input"
                  />
                </Form.Item>
    
                <Form.Item style={{ marginBottom: 0 }}>
                  <div className="gzx-submit-wrap">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      className="gzx-submit-btn"
                    >
                      {submitText}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
    
        <style jsx global>{`
          .gzx-review-wrap {
            margin-top: 28px;
            padding: 22px;
            border-radius: 18px;
            background: linear-gradient(180deg, #111314 0%, #0d0f10 100%);
            border: 1px solid #24282a;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
          }
    
          .gzx-review-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 18px;
            padding-bottom: 16px;
            border-bottom: 1px solid #2a2d2e;
          }
    
          .gzx-review-title {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            line-height: 1.2;
          }
    
          .gzx-review-subtitle {
            margin: 6px 0 0;
            color: #8b949e;
            font-size: 13px;
          }
    
          .gzx-review-count {
            flex-shrink: 0;
            padding: 8px 14px;
            border-radius: 999px;
            background: rgba(0, 255, 224, 0.08);
            border: 1px solid rgba(0, 255, 224, 0.22);
            color: #00ffe0;
            font-weight: 700;
            font-size: 13px;
          }
    
          .gzx-review-list {
            margin-bottom: 10px;
          }
    
          .gzx-comment-card {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 16px;
            margin-bottom: 14px;
            border-radius: 16px;
            background: #141719;
            border: 1px solid #222629;
            transition: transform 0.25s ease, border-color 0.25s ease,
              box-shadow 0.25s ease;
          }
    
          .gzx-comment-card:hover {
            transform: translateY(-2px);
            border-color: rgba(0, 255, 224, 0.3);
            box-shadow: 0 10px 24px rgba(0, 255, 224, 0.08);
          }
    
          .gzx-comment-avatar {
            flex-shrink: 0;
            background: linear-gradient(135deg, #00d5c0, #00b894) !important;
            color: #ffffff !important;
            font-weight: 800;
            border: 1px solid #2d3336;
          }
    
          .gzx-comment-avatar img {
            object-fit: cover !important;
          }
    
          .gzx-comment-main {
            flex: 1;
            min-width: 0;
          }
    
          .gzx-comment-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 8px;
          }
    
          .gzx-comment-user {
            min-width: 0;
          }
    
          .gzx-comment-author {
            display: block;
            color: #ffffff !important;
            font-weight: 800;
            margin-bottom: 4px;
            word-break: break-word;
          }
    
          .gzx-comment-rate {
            color: #faad14 !important;
            font-size: 14px !important;
          }
    
          .gzx-comment-time {
            color: #8b949e !important;
            font-size: 12px;
            white-space: nowrap;
            flex-shrink: 0;
          }
    
          .gzx-comment-text {
            margin: 0 0 12px;
            color: #d1d5db;
            line-height: 1.7;
            word-break: break-word;
            font-size: 14px;
          }
    
          .gzx-comment-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
    
          .gzx-action-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid #303435;
            background: #111314;
            color: #b8b8b8;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
          }
    
          .gzx-action-pill:hover {
            color: #00ffe0;
            border-color: #00ffe0;
            background: rgba(0, 255, 224, 0.06);
          }
    
          .gzx-action-pill.liked {
            color: #00c781;
            border-color: rgba(0, 199, 129, 0.35);
            background: rgba(0, 199, 129, 0.08);
          }
    
          .gzx-action-pill.disliked {
            color: #ff6b6b;
            border-color: rgba(255, 107, 107, 0.35);
            background: rgba(255, 107, 107, 0.08);
          }
    
          .gzx-empty-box {
            padding: 24px 12px;
            text-align: center;
          }
    
          .gzx-empty-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }
    
          .gzx-empty-title {
            color: #ffffff;
            font-weight: 700;
            margin-bottom: 4px;
          }
    
          .gzx-empty-text {
            color: #8b949e;
            font-size: 13px;
          }
    
          .gzx-form-box {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            margin-top: 18px;
            padding-top: 18px;
            border-top: 1px solid #2a2d2e;
          }
    
          .gzx-form-left {
            flex-shrink: 0;
          }
    
          .gzx-form-right {
            flex: 1;
            min-width: 0;
          }
    
          .gzx-review-form {
            padding: 16px;
            border-radius: 16px;
            background: #141719;
            border: 1px solid #222629;
          }
    
          .gzx-form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
            flex-wrap: wrap;
          }
    
          .gzx-form-title {
            color: #ffffff !important;
            font-weight: 800;
            font-size: 15px;
          }
    
          .gzx-form-rate {
            color: #faad14 !important;
          }
    
          .gzx-comment-input {
            background: #101214 !important;
            border: 1px solid #303435 !important;
            border-radius: 14px !important;
            color: #ffffff !important;
            resize: none;
            padding: 12px 14px !important;
          }
    
          .gzx-comment-input::placeholder {
            color: #6b7280 !important;
          }
    
          .gzx-comment-input:hover,
          .gzx-comment-input:focus {
            border-color: #00ffe0 !important;
            box-shadow: 0 0 0 3px rgba(0, 255, 224, 0.08) !important;
          }
    
          .gzx-submit-wrap {
            display: flex;
            justify-content: center;
          }
    
          .gzx-submit-btn {
            min-width: 170px;
            height: 44px !important;
            padding: 0 24px !important;
            border: none !important;
            border-radius: 999px !important;
            background: linear-gradient(135deg, #ff5a00, #ff7e1a) !important;
            font-weight: 800 !important;
            box-shadow: 0 12px 26px rgba(255, 102, 0, 0.22) !important;
          }
    
          .gzx-submit-btn:hover {
            background: linear-gradient(135deg, #ff6a1a, #ff8d2c) !important;
          }
    
          .gzx-login-alert {
            background: rgba(250, 173, 20, 0.08) !important;
            border-color: rgba(250, 173, 20, 0.28) !important;
            border-radius: 14px !important;
          }
    
          .gzx-login-alert .ant-alert-message {
            color: #facc15 !important;
          }
    
          .gzx-login-link {
            color: #00ffe0;
            font-weight: 700;
          }
    
          @media (max-width: 768px) {
            .gzx-review-wrap {
              padding: 16px;
              border-radius: 16px;
            }
    
            .gzx-review-head {
              flex-direction: column;
              align-items: flex-start;
            }
    
            .gzx-review-title {
              font-size: 21px;
            }
    
            .gzx-comment-card {
              padding: 14px;
              gap: 12px;
            }
    
            .gzx-comment-top {
              flex-direction: column;
              gap: 6px;
            }
    
            .gzx-comment-time {
              white-space: normal;
            }
    
            .gzx-form-box {
              gap: 12px;
            }
    
            .gzx-review-form {
              padding: 14px;
            }
    
            .gzx-submit-btn {
              width: 100%;
            }
          }
    
          @media (max-width: 480px) {
            .gzx-review-wrap {
              padding: 12px;
            }
    
            .gzx-review-title {
              font-size: 19px;
            }
    
            .gzx-review-subtitle {
              font-size: 12px;
            }
    
            .gzx-comment-card {
              padding: 12px;
              border-radius: 14px;
            }
    
            .gzx-comment-avatar {
              width: 36px !important;
              height: 36px !important;
              line-height: 36px !important;
            }
    
            .gzx-comment-text {
              font-size: 13px;
            }
    
            .gzx-action-pill {
              padding: 5px 10px;
              font-size: 12px;
            }
    
            .gzx-form-box {
              flex-direction: column;
            }
    
            .gzx-form-left {
              display: none;
            }
    
            .gzx-form-header {
              align-items: flex-start;
            }
          }
        `}</style>
      </div>
    );
};

export default UsersComment;
