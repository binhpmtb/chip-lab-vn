# Adder và ALU nhỏ

## Mục tiêu

Kết hợp các phép toán thành một ALU. Opcode chọn phép cộng, AND, OR hoặc XOR. Độ rộng đầu ra quyết định có giữ carry hay chỉ lấy phần thấp của tổng. Điều này phải nằm trong đặc tả.

## Trường hợp biên

Thử số 0, giá trị lớn nhất, và các toán hạng có mẫu bit xen kẽ. Với phép cộng 4 bit, 15 + 1 kiểm tra overflow. Với phép AND, 1010 và 0101 kiểm tra các bit độc lập.

ALU tổ hợp không cần clock. Đầu ra thay đổi khi dữ liệu hoặc opcode đổi. Sau synthesis, một số phép toán dùng chung logic và mux chọn kết quả. Số cell phụ thuộc mức tối ưu và cách ánh xạ, vì vậy hãy ghi lại lệnh tổng hợp khi so sánh hai phiên bản.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [3:0] a, b, input op, output [3:0] y);
  assign y = op ? (a & b) : (a + b);
endmodule
```
