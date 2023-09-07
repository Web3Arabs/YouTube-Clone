//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

contract YouTube {
    // يعمل المتغير على تخزين عدد الفيديوهات
    uint256 public videoCount;
    // اسم العقد الذكي الخاص بك
    string public name = "YouTube";
    // يعمل على إستدعاء الفيديو حسب موقعه mapping إنشاء
    mapping(uint256 => Video) public videos;

    // بالخصائص التالية Video يدعى struct إنشاء
    struct Video {
        uint256 id;           // رقم الفيديو
        string hash;          // تجزئة الفيديو بعد تحميله
        string title;         // عنوان الفيديو
        string description;   // الوصف
        string location;      // الموقع
        string category;      // الفئة
        string thumbnailHash; // رابط الصورة المصغرة
        uint256 createdAt;    // الوقت
        address author;       // مالك الفيديو
    }

    // يقوم بتصدير خصائص الفيديو VideoUploaded يدعى event إنشاء
    event VideoUploaded(
        uint256 id,
        string hash,
        string title,
        string description,
        string location,
        string category,
        string thumbnailHash,
        uint256 createdAt,
        address author
    );

    constructor() {}

    // تعمل الدالة على نشر الفيديو
    function uploadVideo(
        string memory _videoHash,
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _category,
        string memory _thumbnailHash
    ) public {
        // التحقق من صحة تجزئة الفيديو والعنوان ومالك الفيديو
        require(bytes(_videoHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

        // زيادة عدد الفيديوهات في كل مرة يقوم العقد بنشر فيديو
        videoCount++;
        // إضافة الفيديو إلى العقد الذكي
        videos[videoCount] = Video(
            videoCount,
            _videoHash,
            _title,
            _description,
            _location,
            _category,
            _thumbnailHash,
            block.timestamp,
            msg.sender
        );
        // blockchain إضافة التغييرات/الحدث على
        emit VideoUploaded(
            videoCount,
            _videoHash,
            _title,
            _description,
            _location,
            _category,
            _thumbnailHash,
            block.timestamp,
            msg.sender
        );
    }
}
