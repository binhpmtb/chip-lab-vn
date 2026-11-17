# Cell library và đánh đổi PPA

## Mục tiêu

Hiểu power, performance và area cần dữ liệu gì. Thư viện Liberty mô tả đặc tính timing, điện dung và thông tin công suất của các cell trong những điều kiện xác định. LEF mô tả hình học trừu tượng phục vụ bố trí và nối dây.

## So sánh có điều kiện

Một cell lớn hơn có thể kéo tải nhanh hơn nhưng tăng diện tích và điện dung. Tối ưu timing có thể chèn buffer hoặc nhân bản logic. Công suất động phụ thuộc hoạt động chuyển mạch, tải và điện áp, vì vậy số cell đơn thuần không đủ để suy ra power.

Thống kê trong playground hữu ích để học cấu trúc logic. Một báo cáo PPA thực cần công nghệ, corner, constraints và giai đoạn flow. Ghi các điều kiện này cùng kết quả để người khác có thể lặp lại phép đo.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [3:0] a, output y);
  assign y = |a;
endmodule
```
