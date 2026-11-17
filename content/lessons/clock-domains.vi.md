# Clock domain và đồng bộ tín hiệu

## Mục tiêu

Nhận ra tín hiệu đến từ clock khác hoặc từ ngoài chip. Nó có thể thay đổi gần cạnh lấy mẫu của miền nhận. Flip-flop đầu tiên có nguy cơ metastability, một trạng thái analog cần thời gian để ổn định.

## Đồng bộ một bit

Chuỗi hai flip-flop trong miền nhận thường dùng cho tín hiệu mức một bit thay đổi đủ chậm. Tầng thứ hai cho thêm thời gian phân giải và giảm xác suất lỗi. Nó không loại bỏ hoàn toàn rủi ro và không đảm bảo bắt được mọi xung ngắn.

Bus nhiều bit cần giao thức phù hợp như handshake hoặc asynchronous FIFO. Đồng bộ riêng từng bit có thể tạo từ dữ liệu không nhất quán. Mô phỏng RTL chỉ kiểm tra chuỗi cập nhật, còn đánh giá CDC và metastability cần phương pháp riêng.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, async_in, output reg sync_out);
  reg first;
  always @(posedge clk) begin
    first <= async_in;
    sync_out <= first;
  end
endmodule
```
