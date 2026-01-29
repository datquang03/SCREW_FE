import React from "react";
import { Row, Col, Skeleton } from "antd";

export default function EquipmentSkeletonLoading({ count = 6 }) {
  return (
    <Row gutter={[32, 64]}>
      {[...Array(count)].map((_, index) => (
        <Col xs={24} sm={12} lg={8} key={index}>
          <div className="bg-white border border-slate-100 rounded-sm overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-[4/5] bg-slate-100">
              <Skeleton.Image
                active
                className="!w-full !h-full !rounded-none"
              />
            </div>

            {/* Content skeleton */}
            <div className="p-8 space-y-6">
              <Skeleton
                active
                title={{ width: "70%" }}
                paragraph={{ rows: 2, width: ["100%", "80%"] }}
              />

              {/* Availability */}
              <div className="space-y-3">
                <Skeleton.Input
                  active
                  size="small"
                  className="!w-full !h-[8px]"
                />
                <div className="flex gap-2">
                  <Skeleton.Button active size="small" />
                  <Skeleton.Button active size="small" />
                </div>
              </div>

              {/* Price */}
              <div className="pt-6 border-t border-slate-50">
                <Skeleton.Input
                  active
                  size="default"
                  className="!w-[120px]"
                />
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}
