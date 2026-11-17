# Decoder và mã ưu tiên

## Mục tiêu

Phân biệt giải mã và mã hóa ưu tiên. Decoder 2 sang 4 bật một bit tương ứng với địa chỉ đầu vào. Mã 00 chọn bit 0, mã 11 chọn bit 3. Priority encoder nhận nhiều yêu cầu và chọn yêu cầu có ưu tiên cao nhất.

## Tránh latch ngoài ý muốn

Trong always @*, mỗi đầu ra cần được gán trên mọi nhánh. Hãy đặt giá trị mặc định trước case hoặc if. Nếu bỏ sót một nhánh, mạch có thể cần giữ giá trị trước đó và suy ra latch.

Thứ tự if/else thể hiện ưu tiên. Testbench cần thử nhiều yêu cầu cùng bật và trường hợp không có yêu cầu. Với decoder, kiểm tra đầu ra one-hot bằng cách đối chiếu từng địa chỉ với đúng một bit bật.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [1:0] a, output [3:0] y);
  assign y = 4'b0001 << a;
endmodule
```
