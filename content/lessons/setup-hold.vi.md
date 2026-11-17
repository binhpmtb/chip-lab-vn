# Setup, hold và critical path

## Mục tiêu

Hiểu dữ liệu phải ổn định quanh cạnh lấy mẫu. Setup yêu cầu dữ liệu đến đủ sớm trước cạnh clock. Hold yêu cầu dữ liệu tiếp tục ổn định đủ lâu sau cạnh. Vi phạm có thể gây hành vi không xác định ở phần cứng.

## Một đường register-to-register

Dữ liệu đi từ clock-to-Q của thanh ghi phát, qua logic và dây nối, tới chân D của thanh ghi nhận. Kiểm tra setup so sánh thời gian đến với thời gian yêu cầu. Slack âm báo vi phạm trong điều kiện phân tích đó.

RTL simulation lý tưởng thường không mô hình hóa trễ cell hoặc metastability. Một waveform đúng chức năng chưa chứng minh timing đạt. Pipeline chia logic giữa nhiều tầng để giảm đường dài, đổi lại tăng latency. Đo timing thực cần library, parasitic và ràng buộc clock phù hợp.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, input [3:0] a, b, output reg [4:0] q);
  always @(posedge clk) q <= {1'b0, a} + {1'b0, b};
endmodule
```
