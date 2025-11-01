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
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
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

const UsersComment: React.FC<UsersCommentProps> = ({
  productId,
  accessToken,
  apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  currentUser = { name: "Bạn", avatar: "https://joeschmoe.io/api/v1/random" },
  placeholder = "Nhập bình luận của bạn...",
  submitText = "Gửi đánh giá",
}) => {
  const { message } = App.useApp();

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [value, setValue] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        `${apiBase}/api/v1/reviews?productId=${productId}&page=1&limit=20&sort=recent`,
        { headers }
      );
      const d = await res.json();
      const items = (d?.items || d?.data?.items || []).map((r: any) => ({
        _id: r._id,
        author: r.createdBy?.email || r.userId?.email || "Ẩn danh",
        avatar: r.userId?.avatar || undefined,
        content: r.comment || "",
        rating: r.rating || 0,
        createdAt: r.createdAt || new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        action: null,
      }));
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
  }, [productId]);

  // ===== POST review =====
  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/reviews`, {
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

  return (
    <div style={{ marginTop: 24 }}>
      {/* Danh sách bình luận */}
      <List
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: "Chưa có bình luận nào." }}
        header={comments.length ? `${comments.length} bình luận` : undefined}
        itemLayout="horizontal"
        renderItem={(item, idx) => (
          <div
            key={item._id || `${item.author}-${idx}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Avatar src={item.avatar || undefined}>
              {!item.avatar ? item.author.charAt(0).toUpperCase() : null}
            </Avatar>

            <div style={{ flex: 1 }}>
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                {/* header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Text strong>{item.author}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </div>

                {/* rating + content */}
                <div>
                  {item.rating ? (
                    <Rate disabled defaultValue={item.rating} />
                  ) : null}
                  <p style={{ margin: "4px 0 0" }}>{item.content}</p>
                </div>

                {/* actions */}
                <Space size={16} style={{ color: "rgba(0,0,0,0.45)" }}>
                  <Tooltip title="Like">
                    <span
                      onClick={() => handleLike(idx)}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      {item.action === "liked" ? (
                        <LikeFilled />
                      ) : (
                        <LikeOutlined />
                      )}{" "}
                      {item.likes}
                    </span>
                  </Tooltip>

                  <Tooltip title="Dislike">
                    <span
                      onClick={() => handleDislike(idx)}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      {item.action === "disliked" ? (
                        <DislikeFilled />
                      ) : (
                        <DislikeOutlined />
                      )}{" "}
                      {item.dislikes}
                    </span>
                  </Tooltip>

                  <span style={{ cursor: "pointer" }}>Reply to</span>
                </Space>
              </Space>
            </div>
          </div>
        )}
      />

      {/* Form nhập đánh giá */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginTop: 24,
        }}
      >
        <Avatar src={currentUser.avatar || undefined}>
          {!currentUser.avatar
            ? currentUser.name.charAt(0).toUpperCase()
            : null}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Form onFinish={handleSubmit}>
            <Form.Item style={{ marginBottom: 8 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>Đánh giá của bạn:</Text>
                <Rate value={rating} onChange={setRating} />
                <TextArea
                  rows={4}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                />
              </Space>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {submitText}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UsersComment;
