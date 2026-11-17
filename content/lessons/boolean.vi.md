# Đại số Boolean và De Morgan

## Mục tiêu

Nhận biết hai biểu thức logic tương đương. Luật De Morgan cho biết ~(a & b) bằng ~a | ~b, và ~(a | b) bằng ~a & ~b. Dấu ngoặc làm rõ thứ tự tính toán và giúp tránh lỗi khi sửa RTL.

## Từ biểu thức đến phần cứng

Half-adder có sum = a ^ b và carry = a & b. Hai đầu ra biểu diễn tổng hai bit. Hãy kiểm tra trường hợp a = b = 1, khi sum bằng 0 và carry bằng 1.

Rút gọn biểu thức có thể giảm logic, nhưng kết quả cuối phụ thuộc công cụ tổng hợp và thư viện cell. Hai cách viết khác nhau có thể được tối ưu về cùng netlist. Chứng minh bằng bảng chân trị cho mạch nhỏ trước khi so sánh số cell.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input a, b, output sum, carry);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule
```
