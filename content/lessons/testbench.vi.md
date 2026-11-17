# Testbench tự kiểm tra và VCD

## Mục tiêu

Tạo đầu vào, quan sát đầu ra và so sánh với kết quả mong đợi. Testbench bao quanh thiết kế cần kiểm thử, thường gọi là DUT. Các lệnh delay, display và finish phục vụ mô phỏng và thường không tổng hợp thành phần cứng.

## Đúng thời điểm

Sau khi đổi đầu vào, cho mạch thời gian cập nhật trước khi so sánh. Với logic tuần tự, kiểm tra sau khi nonblocking assignment hoàn tất. Dùng !== để phát hiện cả X hoặc Z ngoài mong đợi.

VCD lưu thay đổi giá trị theo thời gian. $dumpfile chọn tên tệp và $dumpvars chọn phạm vi tín hiệu. Waveform giúp tìm thời điểm sai, còn kiểm tra tự động giúp chạy lại nhiều trường hợp. Một test pass chỉ chứng minh những trường hợp đã kiểm tra, vì vậy cần thêm giá trị biên và chuỗi reset.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input a, b, output y);
  assign y = a & b;
endmodule

// Testbench is entered in the separate testbench editor.
// Use $dumpfile("wave.vcd") and $dumpvars(0, tb).
```
