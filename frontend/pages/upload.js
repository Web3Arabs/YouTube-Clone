import React, { useState, useRef } from "react";
import { BiCloud } from "react-icons/bi";
import { useCreateAsset } from "@livepeer/react";
import ContractAbi from "../../contract/artifacts/contracts/Youtube.sol/YouTube.json"
import { ethers } from "ethers"
import Header from "../components/Header"

export default function Upload() {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("https://picsum.photos/250")
  const [video, setVideo] = useState("");
  const [uploaded, setUploaded] = useState(false)

  const videoRef = useRef();

  const { mutate: createAsset, data: assets, status, progress, error } = useCreateAsset(
    video ? {
      sources: [
        {
          name: video.name,
          file: video,
          storage: {
            ipfs: true,
            metadata: {
              name: title,
              description: description,
            },
          },
        }
      ],
    } : null
  );

  // إستدعاء العقد الذكي للبدء في التعامل معه
  const getContract = async () => {
    // إنشاء مزود جديد
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // signer الحصول على
    const signer = provider.getSigner();
    // إستدعاء العقد الذكي 
    let contract = new ethers.Contract(
      // عقدك الذكي هنا address قم بإضافة
      "0x6d630b93997959ad5326160e18ae3c0ca87ebb16",
      ContractAbi.abi,
      signer
    );
    
    return contract;
  }

  // Livepeer دالة لطلب تحميل الفيديو على
  const uploadVideo = async () => {
    setUploaded(true)
    // لتحميل الفيديو useCreateAsset من الخطاف createAsset إستدعاء دالة
    await createAsset?.()
  };

  // مجرد ان ينقر المستخدم على نشر الفيديو يقوم بنشر الفيديو الى العقد الذكي مباشرة
  const postVideo = async () => {
    // استدعاء العقد الذكي
    let contract = await getContract();

    // نشر الفيديو على العقد الذكي
    let tx = await contract.uploadVideo(
      assets[0]?.id,
      title,
      description,
      location,
      category,
      thumbnail
    );
    await tx.wait()
  };

  const renderButton = () => {
    // في حال لم يتم تحميل الفيديو بعد سيقوم بإظهار زر التحميل
    if (!uploaded) {
      return (
        <button
          onClick={() => {
            uploadVideo()
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
        >
          <BiCloud />
          <p className="mr-2">تحميل</p>
        </button>
      )
    }
    else {
      // سيتوجب عليه الإنتظار اولاً Livepeer في حال لم يكتمل تحميل الفيديو على
      if (!assets) {
        return (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
          >
            <p className="mr-2">جاري الإنتظار...</p>
          </button>
        )
      }
      // سيظهر للمستخدم زر نشر الفيديو Livepeer بمجرد ان يتم تحميل الفيديو على
      if (assets) {
        return (
          <button
            onClick={() => {
              postVideo()
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
          >
            <BiCloud />
            <p className="mr-2">نشر الفيديو</p>
          </button>
        )
      }
    }
  }

  return (
    <div dir="rtl">
      <Header />
      <div className="w-full h-screen flex flex-row -mt-8">
        <div className="flex-1 flex flex-col">
          <div className="mt-5 mr-10 flex  justify-end">
            <div className="flex items-center ml-8">
              <a href="/" className="bg-transparent text-black py-2 px-6 border rounded-lg border-black ml-6">
                رجوع
              </a>
              {renderButton()}
            </div>
          </div>
          <div className="flex flex-col m-10     mt-5  lg:flex-row">
            <div className="flex lg:w-3/4 flex-col ">
              <label className="text-black text-sm">عنوان الفيديو</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="لماذا يجب عليك تعلم Web3؟"
                className="w-[90%] text-black placeholder:text-gray-500 rounded-md mt-2 h-12 p-2 border border-[#444752] focus:outline-none"
              />
              <label className="text-black mt-10">الوصف</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="يعد تعلم Web3 الان يشابه شراء البيتكوين عام 2009 والإستثمار بالعديد من العملات المشفرة حتى يومنا هذا."
                className="w-[90%] text-black h-32 placeholder:text-gray-500  rounded-md mt-2 p-2 border border-[#444752] focus:outline-none"
              />
              <label className="text-black mt-10">الصورة المصغرة</label>
              <input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="قم بوضع رابط الصورة المصغرة - مثال: https://picsum.photos/250"
                className="w-[90%] text-black placeholder:text-gray-500 rounded-md mt-2 h-12 p-2 border border-[#444752] focus:outline-none"
              />

              <div className="flex flex-row mt-10 w-[90%] justify-between">
                <div className="flex flex-col w-2/5">
                  <label className="text-black text-sm">الموقع</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="الإمارات - دبي"
                    className="w-[90%] text-black placeholder:text-gray-500 rounded-md mt-2 h-12 p-2 border border-[#444752] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col w-2/5">
                  <label className="text-black text-sm">الفئة</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-[90%] text-black placeholder:text-gray-500 rounded-md mt-2 h-12 p-2 border border-[#444752] focus:outline-none"
                  >
                    <option>اغاني</option>
                    <option>رياضة</option>
                    <option>العاب</option>
                    <option>اخبار</option>
                    <option>ترفيه</option>
                    <option>تعليمي</option>
                    <option>تكنولوجيا</option>
                    <option>رحلة/سفر</option>
                    <option>آخر</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                videoRef.current.click();
              }}
              className={
                video
                  ? " w-96 rounded-md h-64 items-center justify-center flex"
                  : "border-2 border-gray-600  w-96 border-dashed rounded-md mt-8 h-64 items-center justify-center flex"
              }
            >
              {video ? (
                <video
                  controls
                  src={URL.createObjectURL(video)}
                  className="h-full rounded-md"
                />
              ) : (
                <p className="text-[#848891]">رفع فيديو</p>
              )}
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            ref={videoRef}
            accept={"video/*"}
            onChange={(e) => {
              setVideo(e.target.files[0]);
              console.log(e.target.files[0]);
            }}
          />
        </div>
      </div>
    </div>
  );
}
