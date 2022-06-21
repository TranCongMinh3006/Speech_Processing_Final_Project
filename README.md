# Speech_Processing_Final_Project - Nhóm 2

# Phân công công việc
+ Hoàng Phương Linh - Tìm hiểu và viết báo cáo nguyên lý hoạt động, mô hình lý thuyết, cài đặt
+ Trần Công Minh - Thực nghiệm, chạy mô hình, quay video, kết hợp frontend và backend, đánh giá
+ Cao Cẩm Nhung - Thu thập và xử lý dữ liệu
+ Nguyễn Mạnh Tuấn - Viết frontend, kết hợp frontend và backend

# Mô tả chung
## Chức năng của web
Phân biệt bài hát với 2 đầu vào có thể là:
- Ghi âm trực tiếp trên web
- Tải file lên web

Mô hình sẽ trả về:
- Tên bài hát đó nếu bài hát đó có trong cơ sở dữ liệu
- Tên bài hát tương tự nếu bài hát đó không có trong cơ sở dữ liệu

Sau đó Web sẽ trả thẳng video cũng như đường link đến youtube của bài hát đó

## Dữ liệu
- Kho dữ liệu gồm 150 bài hát tiếng Việt lưu dưới định dạng mp3, được trích xuất fingerprint và hash lại để so khớp.

## Phương pháp
Nguyên lý cơ bản là tìm fingerprint của bài nhạc để phân biệt các bản nhạc. Cũng như người có dấu vân tay để phân biệt, thì đoạn nhạc cũng có những đặc trưng để phân biệt với nhau.

Ví dụ như:

+ Nếu trích chọn đặc trưng theo miền thời gian, ta có thể lấy fingerprint của đoạn nhạc từ Bao biên độ, Root mean square energy, Tỉ lệ điểm qua 0. 

+ Nếu trích chọn đặc trưng theo miền tần số, ta có thể khai thác các điểm formant (“peaks” in amplitude), là các điểm cực đại cục bộ, có tần số áp đảo (dominant), mang đặc tính của âm thanh.

### Mô hình của bài tập lớn
  - Trích chọn đặc trưng theo miền tần số
    + Lấy Spectrogram của bản nhạc bằng Short Time Fourier Transform - chạy DFT/FFT trên từng window/frame
    + Tìm những điểm đỉnh formant trong spectrogram có giá trị cường độ lớn nhất (cực đại cục bộ địa phương) - Trả về (frequency_idx, time_idx) của điểm đó
    + Hash tần số của các peak với chênh lệch thời gian giữa các peak đó sẽ là fingerprint của bài hát và được lưu vào cơ sở dữ liệu. Ta sẽ hash lần lượt từng peak một với 1 số peak tiếp theo (sắp xếp theo thứ tự thời gian). Nếu thời gian từ peak đó đến peak khác < 1 ngưỡng tự chọn thì sẽ hash frequency của 2 peak đó và chêch lệch thời gian của 2 peak. Giá trị hash đó sẽ được lấy thành 1 tập các fingerprint của bài hát và được lưu vào cơ sở dữ liệu.
    
        hash(frequencies of peaks, time difference between peaks) = fingerprint hash value
        
        [“frequency of the  anchor”;” frequency of the  point”;”delta time between the anchor and the point”] -> [“absolute time of the anchor in the record”]
   - So khớp fingerprint của bản nhạc với fingerprint các bài nhạc khác trong cơ sở dữ liệu. Về cơ bản thay vì tìm kiếm nột nốt nhạc có tồn tại trong bài hát hay không, thì thuật toán sẽ tìm kiếm 2 nốt nhạc cách nhau 1 khoảng thời gian delta_time có tồn tại trong bài hát không. Thuật toán sẽ trả về bài hát có tỷ lệ giao lớn nhất.

### Cài đặt mô hình
    - Trong fingerprint.py:
        + Lấy Spectrogram của bản nhạc : 
            * Sử dụng mlab.specgram của matplotlib
            * Parameter: Kích thước cửa sổ window_size(frame_size) = 4096
                         Sample_rate = 44100
                         Cửa sổ hàm: Hanning
                         Kích thước hop hop_size = window_size * 0.5
            * Chuyển cường độ theo thang loga 
        + Tìm những điểm đỉnh trong spectrogram có giá trị cường độ lớn nhất (cực đại cục bộ địa phương) - Trả về (frequency_idx, time_idx) của điểm đó
          Sử dụng generate_binary_structure, iterate_structure, maximum_filter của thư viện scipy với số lượng hàng xóm (ở các phía) để xét với điểm đó là PEAK_NEIGHBORHOOD_SIZE = 20
        + Ta sẽ hash lần lượt từng peak một với 15 peak tiếp theo (sắp xếp theo thứ tự thời gian)
        Nếu thời gian từ peak đó đến peak khác < 200 thì sẽ hash frequency của 2 peak đó và chêch lệch thời gian của 2 peak đó bằng hàm sha1 của hashlib
        Giá trị hash đó sẽ được lấy thành 1 tập các fingerprint của bài hát và được lưu vào cơ sở dữ liệu
        hashlib.sha1(str.encode("%s|%s|%s" % (str(freq1), str(freq2), str(t_delta)))).hexdigest()[0:FINGERPRINT_REDUCTION]
        
    - So khớp, tìm bài hát giống nhất:
        * return_matches trong database_sql.py:
          + Trả về các hash, offset = hash(freq1, freq2, delta_time), t1 của bài hát đó
          + Lấy hash_, song_id_, offset_ của tất cả các bài hát trong cơ sở dữ liệu
          + Trả về song_id_, offset - offset_ của (hash == hash_)
        * align_matches trong music_matching/__init__.py:
          + Trả về song_id của bài nhạc có giao nhiều fingerprint nhất của tất cả khoảng chênh lệch thời gian
# Thực nghiệm, đánh giá

# Hướng dẫn sử dụng Web

# Tham khảo
[Christophe/How does Shazam work](http://coding-geek.com/how-shazam-works/)

[willdrevo/Audio Fingerprint Identifying](https://willdrevo.com/fingerprinting-and-audio-recognition-with-python/)

[itspoma(github)/Audio Fingerprint Identifying](https://github.com/itspoma/audio-fingerprint-identifying-python)
