import { useState, useEffect } from 'react'
import Player from '../components/Player'
import ContractAbi from "../../contract/artifacts/contracts/YouTube.sol/YouTube.json"
import { ethers } from "ethers"
import "plyr-react/plyr.css"
import Header from "../components/Header"
import { BiCheck } from "react-icons/bi"
import moment from "moment"

export default function VideoPage() {
  // تخزين بيانات الفيديو
  const [video, setVideo] = useState(null)
  // تخزين الفيديوهات المقترحة
  const [suggestedVideos, setSuggestedVideos] = useState([])

  // الصفحة URL تعمل هذه الدالة بإستدعاء المعلمات من
  const getUrlVars = () => {
    var vars = {}
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value
      }
    )
    return vars
  }

  // إستدعاء العقد الذكي للبدء في التعامل معه
  const getContract = async () => {
    // إنشاء مزود جديد
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // signer الحصول على
    const signer = provider.getSigner();
    // إستدعاء العقد الذكي 
    let contract = new ethers.Contract(
      // عقدك الذكي هنا address قم بإضافة
      "0x9fff1deC37b17b03dcb128408C7846276C471E6a",
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
    // تخزين الفيديو الذي يريد المستخدم تشغيله
    setVideo(vids[getUrlVars().id-1])
    // تخزين الفيديوهات المقترحة
    setSuggestedVideos(vids.slice(-15))
  }

  useEffect(() => {
    getCountsAndVideos()
  }, [])

  return (
    <div dir="rtl">
      <Header />
      <div className="w-full flex flex-row -mt-12">
        <div className="flex-1 flex flex-col">
          {video && (
            <div className="flex flex-col m-10 justify-between lg:flex-row">
              <div className="lg:w-4/6 w-6/6">
                <Player video={video} />
              </div>
              <div className="w-2/6">
                <h4 className="text-md font-bold text-black mr-5 mb-3">
                  فيديوهات مقترحة
                </h4>
                {suggestedVideos.map((video) => (
                  <div
                    onClick={() => {
                      window.location.href = `/video?id=${video.id}`;
                    }}
                    key={video.id}
                    className={`${video.id==getUrlVars().id ? "hidden" : null}`}
                  >
                    <div className="flex flex-row mx-5 mb-5 item-center justify-center cursor-pointer">
                      <img className="object-cover rounded-lg w-60 h-28" src={video.thumbnailHash} />
                      <div className="mr-3 w-80">
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
          )}
        </div>
      </div>
    </div>
  )
}
