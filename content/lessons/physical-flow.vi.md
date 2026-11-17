# Floorplan, placement, CTS và routing

## Mục tiêu

Theo dõi netlist đi tới layout. Floorplan xác định vùng core, macro, chân vào ra và cấu trúc nguồn. Placement đặt standard cell trong vùng hợp lệ. CTS xây cây clock để phân phối clock tới các phần tử tuần tự. Routing kết nối các chân bằng lớp kim loại và via.

## Flow có phản hồi

Sau placement hoặc routing, trễ dây thay đổi kết quả timing. Congestion có thể buộc flow đổi bố trí hoặc tăng diện tích. Các bước tối ưu thường được lặp lại. OpenROAD và OpenLane giúp tự động hóa nhưng người thiết kế vẫn cần đọc log và ràng buộc.

Ví dụ RTL dưới đây là đầu vào nhỏ cho một flow bên ngoài. Trình duyệt thực hiện mô phỏng và synthesis. Để tạo GDSII, chạy flow có PDK và cấu hình tái lập, rồi lưu báo cáo từng bước.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input clk, rst, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 0;
    else q <= q + 1'b1;
endmodule
```
