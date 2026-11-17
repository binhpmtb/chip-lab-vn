# Multiplexer và chọn dữ liệu

## Mục tiêu

Thiết kế mạch chọn một trong hai nguồn dữ liệu. Multiplexer 2:1 có hai đầu vào a, b, một tín hiệu chọn sel và một đầu ra y. Khi sel bằng 0, y lấy a. Khi sel bằng 1, y lấy b.

## Đặc tả và kiểm tra

Toán tử điều kiện sel ? b : a diễn đạt trực tiếp quy tắc này. Một mux cho bus thực hiện lựa chọn trên tất cả bit. Testbench cần đổi cả sel và dữ liệu. Nếu a và b luôn giống nhau, một mux bị đảo lựa chọn có thể vẫn vượt qua kiểm thử.

Mux xuất hiện ở đầu vào thanh ghi, trong ALU và trên đường dữ liệu của CPU. Chuỗi mux quá dài có thể tăng trễ đường tổ hợp. Synthesis có thể đổi cấu trúc nhưng phải giữ hành vi quan sát được.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [3:0] a, b, input sel, output [3:0] y);
  assign y = sel ? b : a;
endmodule
```
