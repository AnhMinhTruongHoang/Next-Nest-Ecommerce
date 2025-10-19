import React from "react";
import { Skeleton, Card, Row, Col } from "antd";

export function OverviewCardsSkeleton() {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Col key={i} xs={24} sm={12} xl={6}>
          <Card className="rounded-[10px] shadow-sm">
            <Skeleton.Avatar active size={48} shape="circle" />

            {/* Text + Value Skeleton */}
            <div className="mt-6 flex items-end justify-between">
              <div>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 70, marginBottom: 8 }}
                />
                <Skeleton.Input active size="small" style={{ width: 100 }} />
              </div>

              <Skeleton.Input active size="small" style={{ width: 50 }} />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
