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

### Mã giả
```
Fingerprint(sound)
  spectrogram <- STFT(sound, window_size = 4096, Sample_rate = 44100, window_function = Hanning, hop_size = window_size * 0.5)
  spectrogram <- 10*log_10(spectrogram)
  peaks <- local_maximum_filter_with_20_samples_from_4_directions_around(spectrogram)
  peaks <- (frequency_peak, time_peak)
  sorted_peaks <- sort_by_time(peaks)
  Array fingerprint 
  for anchor <- 1 to sorted_peaks.length do
    for another_peaks <- anchor to anchor+15 do
      if another_peaks < sorted_peaks.length then
        fre_1 <- peaks[anchor][frequency_peak]  
        fre_2 <- peaks[another_peaks][frequency_peak]
        del_time <- peaks[another_peaks][time_peak] - peaks[anchor][time_peak]
        if 0 < del_time & del_time > 200 then
          hashed_fingerprint = (hash(fre_1, fre_2, del_time), peaks[another_peaks][time_peak])
          Append hashed_fingerprint to fingerprint
   return fingerprint
```
```
Return_matches_and_align_matches(query_sound)
  query_fingerprint <- Fingerprint(query_sound)
  Dict diff_counter
  for query_hash, query_anchor_time in query_fingerprint do
    for hash, anchor_time, song_id in Database do
      if query_hash == hash then
        if anchor_time - query_anchor_time not in diff_counter | song_id not in diff_counter[anchor_time - query_anchor_time] then
          initialize diff_counter[anchor_time - query_anchor_time][song_id] <- 0
        else
          diff_counter[anchor_time - query_anchor_time][song_id] <- diff_counter[anchor_time - query_anchor_time][song_id] + 1
   return song_id with max diff_counter[anchor_time - query_anchor_time][song_id]
```   
  

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
- Thời gian trích xuất 150 bài hát để lưu vào cơ sở dữ liệu hết 6 tiếng
- Kêt quả thử nghiệm: Với thời gian chạy ghi âm là 4s thuật toán cho độ chính xác là 97%. Từ 6s giây trở lên thuật toán cho ra độ chính xác lên đến 100%.
- Thời gian truy vấn một bài hát trung bình tốn khoảng 5-6s.
- link demo : https://drive.google.com/file/d/1W7HUqsPCRczkbaHOyemO_x-MNjoKKLqK/view
# Hướng dẫn sử dụng Web 
- Các ngôn ngữ và công cụ sử dụng cho dự án : python, nodejs, mysql
- Để chạy được dự án chúng ta cần cài biến mô trường cho ffmeg
- Để chạy được phần thuật toán chính của dự án ta cần cài các thư viện đã được liệt kê trong file requirement.txt bằng câu lệnh:
 ```
    $ pip install -r requirement.txt
```
- Để chạy phần giao diện web ta cần cài đặt các thư viện cần thiết bằng câu lệnh
```
    $ npm install
```
- cuối cùng chạy lệnh sau đểu bắt đầu chạy dự án:
```
    $ npm start
```

# Tham khảo
[Christophe/How does Shazam work](http://coding-geek.com/how-shazam-works/)

[willdrevo/Audio Fingerprint Identifying](https://willdrevo.com/fingerprinting-and-audio-recognition-with-python/)

[itspoma(github)/Audio Fingerprint Identifying](https://github.com/itspoma/audio-fingerprint-identifying-python)
