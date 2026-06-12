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

    return (
      <div className="gz-comments-section">
        {/* Danh sách bình luận */}
        <List
          className="gz-comments-list"
          loading={loading}
          dataSource={comments}
          locale={{
            emptyText: <span className="gz-empty-text">Chưa có bình luận nào.</span>,
          }}
          header={
            comments.length ? (
              <div className="gz-comments-header">{comments.length} bình luận</div>
            ) : undefined
          }
          itemLayout="horizontal"
          renderItem={(item, idx) => {
            const avatarSrc = normalizeAvatar(item.avatar);
            const initial = item.author?.trim()?.charAt(0)?.toUpperCase() || "A";
    
            return (
              <div key={item._id || `${item.author}-${idx}`} className="gz-comment-item">
                <Avatar src={avatarSrc} className="gz-comment-avatar">
                  {!avatarSrc ? initial : null}
                </Avatar>
    
                <div className="gz-comment-content">
                  <Space direction="vertical" size={6} style={{ width: "100%" }}>
                    {/* header */}
                    <div className="gz-comment-top">
                      <Text strong className="gz-comment-author">
                        {item.author}
                      </Text>
    
                      <Text className="gz-comment-time">
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </div>
    
                    {/* rating + content */}
                    <div>
                      {item.rating ? (
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          className="gz-comment-rate"
                        />
                      ) : null}
    
                      <p className="gz-comment-text">{item.content}</p>
                    </div>
    
                    {/* actions */}
                    <Space size={16} className="gz-comment-actions">
                      <Tooltip title="Like">
                        <span
                          onClick={() => handleLike(idx)}
                          className={`gz-action-btn ${
                            item.action === "liked" ? "active-like" : ""
                          }`}
                        >
                          {item.action === "liked" ? <LikeFilled /> : <LikeOutlined />}{" "}
                          {item.likes}
                        </span>
                      </Tooltip>
    
                      <Tooltip title="Dislike">
                        <span
                          onClick={() => handleDislike(idx)}
                          className={`gz-action-btn ${
                            item.action === "disliked" ? "active-dislike" : ""
                          }`}
                        >
                          {item.action === "disliked" ? (
                            <DislikeFilled />
                          ) : (
                            <DislikeOutlined />
                          )}{" "}
                          {item.dislikes}
                        </span>
                      </Tooltip>
                    </Space>
                  </Space>
                </div>
              </div>
            );
          }}
        />
    
        {/* Form nhập đánh giá */}
        <div className="gz-comment-form-wrap">
          <Avatar src={currentUserAvatar} className="gz-comment-avatar">
            {!currentUserAvatar ? currentUserInitial : null}
          </Avatar>
    
          <div className="gz-comment-form-content">
            {!accessToken ? (
              <Alert
                type="warning"
                showIcon
                className="gz-login-alert"
                message={
                  <Space>
                    <LoginOutlined />
                    <span>
                      Vui lòng{" "}
                      <a href="/auth/signin" className="gz-login-link">
                        đăng nhập
                      </a>{" "}
                      để gửi đánh giá.
                    </span>
                  </Space>
                }
              />
            ) : (
              <Form onFinish={handleSubmit} className="gz-comment-form">
                <Form.Item style={{ marginBottom: 10 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text className="gz-form-label">Đánh giá của bạn:</Text>
    
                    <Rate value={rating} onChange={setRating} className="gz-form-rate" />
    
                    <TextArea
                      rows={4}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={placeholder}
                      className="gz-comment-textarea"
                    />
                  </Space>
                </Form.Item>
    
                <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    className="gz-submit-review-btn"
                  >
                    {submitText}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
    
        {/* Style */}
        <style jsx global>{`
          .gz-comments-section {
            margin-top: 24px;
            background: #111314;
            border: 1px solid #2a2d2e;
            border-radius: 16px;
            padding: 18px;
          }
    
          .gz-comments-list {
            color: #e5e7eb;
          }
    
          .gz-comments-list .ant-list-header {
            border-bottom: 1px solid #303435 !important;
          }
    
          .gz-comments-list .ant-list-empty-text {
            color: #8b949e !important;
          }
    
          .gz-comments-header {
            color: #ffffff;
            font-weight: 800;
            font-size: 18px;
          }
    
          .gz-empty-text {
            color: #8b949e;
          }
    
          .gz-comment-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 0;
            border-bottom: 1px solid #2a2d2e;
          }
    
          .gz-comment-item:last-child {
            border-bottom: none;
          }
    
          .gz-comment-avatar {
            flex-shrink: 0;
            background: #00b894 !important;
            color: #ffffff !important;
            font-weight: 800;
            border: 1px solid #303435;
          }
    
          .gz-comment-content {
            flex: 1;
            min-width: 0;
          }
    
          .gz-comment-top {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 12px;
          }
    
          .gz-comment-author {
            color: #ffffff !important;
            font-weight: 800;
            max-width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
    
          .gz-comment-time {
            color: #8b949e !important;
            font-size: 12px;
            white-space: nowrap;
          }
    
          .gz-comment-rate {
            color: #faad14 !important;
            font-size: 15px !important;
          }
    
          .gz-comment-text {
            margin: 6px 0 0;
            color: #d1d5db;
            line-height: 1.65;
            word-break: break-word;
          }
    
          .gz-comment-actions {
            color: #8b949e;
          }
    
          .gz-action-btn {
            cursor: pointer;
            user-select: none;
            transition: color 0.2s ease;
          }
    
          .gz-action-btn:hover {
            color: #00ffe0;
          }
    
          .gz-action-btn.active-like {
            color: #00c781;
          }
    
          .gz-action-btn.active-dislike {
            color: #ff4d4f;
          }
    
          .gz-comment-form-wrap {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-top: 22px;
            padding-top: 20px;
            border-top: 1px solid #303435;
          }
    
          .gz-comment-form-content {
            flex: 1;
            min-width: 0;
          }
    
          .gz-login-alert {
            background: rgba(250, 173, 20, 0.1) !important;
            border-color: rgba(250, 173, 20, 0.35) !important;
          }
    
          .gz-login-alert .ant-alert-message {
            color: #facc15 !important;
          }
    
          .gz-login-link {
            color: #00ffe0;
            font-weight: 700;
          }
    
          .gz-form-label {
            color: #ffffff !important;
            font-weight: 700;
          }
    
          .gz-form-rate {
            color: #faad14 !important;
          }
    
          .gz-comment-textarea {
            background: #181a1b !important;
            border-color: #303435 !important;
            color: #ffffff !important;
            border-radius: 12px !important;
            resize: none;
          }
    
          .gz-comment-textarea::placeholder {
            color: #6b7280 !important;
          }
    
          .gz-comment-textarea:hover,
          .gz-comment-textarea:focus {
            border-color: #00ffe0 !important;
            box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
          }
    
          .gz-submit-review-btn {
            min-width: 140px;
            height: 40px;
            border-radius: 999px !important;
            border: none !important;
            background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
            font-weight: 800 !important;
            box-shadow: 0 10px 22px rgba(255, 77, 0, 0.18) !important;
          }
    
          @media (max-width: 768px) {
            .gz-comments-section {
              padding: 14px;
              border-radius: 14px;
            }
    
            .gz-comment-item {
              gap: 10px;
              padding: 12px 0;
            }
    
            .gz-comment-top {
              flex-direction: column;
              align-items: flex-start;
              gap: 2px;
            }
    
            .gz-comment-author {
              max-width: 100%;
              font-size: 14px;
            }
    
            .gz-comment-time {
              font-size: 11px;
            }
    
            .gz-comment-rate {
              font-size: 13px !important;
            }
    
            .gz-comment-text {
              font-size: 13px;
            }
    
            .gz-comment-actions {
              font-size: 13px;
            }
    
            .gz-comment-form-wrap {
              gap: 10px;
            }
    
            .gz-submit-review-btn {
              width: 100%;
            }
          }
    
          @media (max-width: 420px) {
            .gz-comments-section {
              padding: 12px;
            }
    
            .gz-comment-avatar {
              width: 34px !important;
              height: 34px !important;
              line-height: 34px !important;
            }
    
            .gz-comment-form-wrap {
              align-items: flex-start;
            }
    
            .gz-comment-textarea {
              font-size: 13px;
            }
          }
        `}</style>
      </div>
    );
};

export default UsersComment;
