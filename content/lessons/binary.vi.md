# Bit, nhị phân và độ rộng

## Mục tiêu

Đọc một giá trị nhị phân và xác định số bit cần để lưu nó. Với n bit không dấu, miền giá trị là 0 đến 2^n − 1. Ví dụ 4'b1010 biểu diễn 10. Các chữ số có trọng số 8, 4, 2, 1 từ trái sang phải.

## Độ rộng là một phần của thiết kế

Một tổng có thể cần thêm bit nhớ. Tổng hai số 4 bit có giá trị tối đa 30, nên cần 5 bit. Nếu chỉ giữ 4 bit, kết quả được lấy modulo 16. Đừng để việc cắt bit xảy ra ngoài ý muốn.

Trong Verilog, literal có thể chỉ rõ độ rộng và cơ số. Dùng 4'd10 khi muốn thể hiện giá trị thập phân trong 4 bit. Một bit chưa khởi tạo có thể là X trong mô phỏng. X là thông tin chưa biết, vì vậy cần kiểm tra reset trước khi kết luận mạch sai.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [3:0] a, b, output [4:0] y);
  assign y = {1'b0, a} + {1'b0, b};
endmodule
```
