# Cổng logic và bảng chân trị

## Mục tiêu

Chuyển một mô tả bằng lời thành bảng chân trị. AND chỉ bằng 1 khi cả hai đầu vào bằng 1. OR bằng 1 khi có ít nhất một đầu vào bằng 1. XOR bằng 1 khi hai đầu vào khác nhau. NOT đảo từng bit.

## Kiểm thử đầy đủ

Mạch hai đầu vào một bit có bốn tổ hợp. Hãy thử 00, 01, 10 và 11. Bảng chân trị cung cấp một đặc tả nhỏ có thể kiểm tra toàn bộ. Với bus, toán tử & và | thao tác trên từng vị trí bit. Toán tử && và || kiểm tra giá trị logic của cả toán hạng.

Continuous assignment mô tả quan hệ tổ hợp. Khi đầu vào đổi, bộ mô phỏng cập nhật đầu ra theo lịch sự kiện. Một phép gán không tự tạo clock hoặc phần tử nhớ.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input a, b, output y);
  assign y = a & b;
endmodule
```
