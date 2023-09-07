import { useState, useEffect } from 'react'
import ContractAbi from "../../contract/artifacts/contracts/YouTube.sol/YouTube.json"
import { ethers } from "ethers"
import Header from "../components/Header"
import { BiCheck } from "react-icons/bi";
import moment from "moment";

export default function home() {
  // تخزين بيانات الفيديوهات هنا بعد إستدعائها من العقد الذكي
  const [videos, setVideos] = useState([])

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

  // إستدعاء عدد الفيديوهات والفيديوهات من العقد الذكي
  const getCountsAndVideos = async () => {
    // استدعاء العقد الذكي
    const contract = await getContract()

    // في العقد الذكي videoCount إستدعاء عدد الفيديوهات من المتغير
    const count = await contract.videoCount()

    // تجميع الفيديوهات في مصفوفة
    const vids = []
    // إنشاء حلقة دوران لإستدعاء بيانات كل فيديو حسب موقعه في العقد الذكي
    for (let i=1; i<=count.toString(); i++) {
      vids.push(await contract.videos(i))
    }
    setVideos(vids)
  }

  useEffect(() => {
    getCountsAndVideos()
  }, [])

  return (
    <div dir="rtl">
      <Header />
      <div className="grid mx-3 gap-x-2 gap-y-5 mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((video, idx) => (
          <div
            key={idx}
            onClick={() => {
              // يقوم بنقلنا الى صفحة تشغيل الفيديو (سنقوم بإنشائها بعد الإنتهاء من هذا)
              window.location.href = `/video?id=${video.id}`;
            }}
          >
            <div className="mx-3 group sm:max-w-sm cursor-pointer">
              <img className="object-cover rounded-lg w-full h-40" src={video.thumbnailHash} />
              <div className="mt-3 space-y-2">
                <h4 className="text-md font-bold text-black mt-3">
                  {video.title}
                </h4>
                <p className="text-sm flex items-center text-[#878787] mt-1">
                  {video.category + " • " + moment(video.createdAt.toString() * 1000).fromNow()}
                </p>
                <p className="text-sm flex items-center text-[#878787] mt-1">
                  ...{video?.author?.slice(0, 9)}{" "}
                  <BiCheck size="20px" color="green" className="ml-1" />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
