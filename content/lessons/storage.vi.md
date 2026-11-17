# Latch, flip-flop và reset

## Mục tiêu

Hiểu cách mạch lưu trạng thái. Latch nhạy mức và có thể truyền dữ liệu khi enable đang hoạt động. Flip-flop nhạy cạnh lấy mẫu dữ liệu tại một cạnh clock. Hai phần tử có hành vi thời gian khác nhau.

## Mô tả flip-flop

always @(posedge clk) mô tả cập nhật ở cạnh lên. Dùng phép gán không chặn <= cho trạng thái tuần tự. Trong cùng một cạnh clock, các biểu thức bên phải đọc trạng thái cũ, rồi cập nhật được lên lịch.

Reset đồng bộ chỉ tác động khi có cạnh clock. Reset bất đồng bộ được thêm vào danh sách sự kiện và có thể tác động giữa hai cạnh. Testbench phải phù hợp loại reset, kiểm tra cả khi reset được bật lẫn khi được nhả.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, rst, d, output reg q);
  always @(posedge clk)
    if (rst) q <= 1'b0;
    else q <= d;
endmodule
```
