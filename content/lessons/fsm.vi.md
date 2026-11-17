# FSM và phát hiện cạnh

## Mục tiêu

Mô tả hành vi phụ thuộc lịch sử bằng máy trạng thái. FSM gồm trạng thái hiện tại, quy tắc chuyển trạng thái và đầu ra. Moore phụ thuộc trạng thái, còn Mealy có thể phụ thuộc cả đầu vào hiện tại.

## Một FSM rất nhỏ

Bộ phát hiện cạnh lên lưu giá trị đầu vào của chu kỳ trước. Nếu đầu vào hiện tại bằng 1 và giá trị trước bằng 0, đầu ra báo cạnh. Cần xác định rõ đầu ra là tổ hợp hay được đăng ký để viết testbench đúng thời điểm.

Vẽ trạng thái và các điều kiện chuyển trước khi code. Thử reset, tự lặp, từng đường chuyển và chuỗi tín hiệu liên tiếp. Default trong logic next-state giúp tránh latch. Một FSM đúng cần giữ được hành vi ở cả chuỗi dài, không chỉ một chuyển trạng thái.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, rst, signal_in, output pulse);
  reg previous;
  always @(posedge clk)
    if (rst) previous <= 1'b0;
    else previous <= signal_in;
  assign pulse = signal_in & ~previous;
endmodule
```
