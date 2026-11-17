# Register, enable và counter

## Mục tiêu

Xây bộ đếm có reset và enable. Thanh ghi n bit lưu một vector trạng thái. Mỗi cạnh clock, counter có thể tăng, giữ nguyên hoặc về 0 theo tín hiệu điều khiển.

## Thứ tự ưu tiên

Nếu reset và enable cùng bật, đặc tả phải nêu tín hiệu nào thắng. Ví dụ dưới đây cho reset ưu tiên. Khi enable bằng 0, việc không gán trong khối tuần tự có nghĩa là giữ trạng thái. Điều này hợp lệ cho flip-flop.

Counter 4 bit tăng từ 15 về 0 do cắt về bốn bit. Kiểm tra wraparound, reset giữa quá trình và nhiều chu kỳ disable. Dùng clock enable ở đầu vào trạng thái giúp giữ một miền clock rõ ràng. Việc tự tạo clock bằng logic tổ hợp cần phân tích timing riêng.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, rst, en, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 4'd0;
    else if (en) q <= q + 1'b1;
endmodule
```
