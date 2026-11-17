# DRC, LVS và portfolio tái lập

## Mục tiêu

Phân biệt kiểm tra hình học và kiểm tra kết nối. DRC kiểm tra layout theo các quy tắc công nghệ, ví dụ khoảng cách và độ rộng. LVS so sánh mạch trích xuất từ layout với netlist tham chiếu. Timing analysis kiểm tra các yêu cầu thời gian trong những corner đã chọn.

## Lưu bằng chứng

Một dự án học tập nên ghi rõ commit RTL, phiên bản tool, PDK, clock mục tiêu và lệnh chạy. Lưu báo cáo, ảnh layout và các giới hạn đã biết. Khi thay đổi utilization hoặc clock period, so sánh cùng một tập chỉ số và giải thích nguyên nhân.

Lộ trình Physical Design có thể bắt đầu bằng một counter nhỏ, rồi tăng lên ALU, UART hoặc CPU. Hoàn thành một flow tái lập và giải thích log giúp xây nền tảng cho timing closure sâu hơn.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, rst, en, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 0;
    else if (en) q <= q + 1'b1;
endmodule
```
