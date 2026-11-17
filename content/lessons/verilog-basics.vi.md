# Module, vector và toán tử

## Mục tiêu

Đọc một module qua giao diện cổng. input đi vào khối, output đi ra. Một vector [7:0] có tám bit, trong đó bit 7 là bit có chỉ số cao nhất. a[3:0] lấy bốn bit thấp, còn {a, b} nối hai vector.

## Chọn toán tử đúng

^a là reduction XOR, gom các bit thành một bit parity. a ^ b là XOR từng bit của hai toán hạng. Kết quả và độ rộng của hai cách dùng khác nhau.

Trong Verilog cổ điển, reg chỉ kiểu biến có thể gán trong procedural block và không tự khẳng định phần cứng là thanh ghi. SystemVerilog thêm logic và always_comb/always_ff để diễn tả ý định rõ hơn. Khả năng hỗ trợ SystemVerilog phụ thuộc engine, nên dùng subset đã kiểm thử cho bài nhập môn.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input [7:0] a, output parity);
  assign parity = ^a;
endmodule
```
