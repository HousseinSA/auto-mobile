import { BiSupport } from "react-icons/bi"
import { FaMoneyCheckAlt } from "react-icons/fa"
import { AiOutlineDownload } from "react-icons/ai"

const ServiceFeatures = () => {
  return (
    <div className="bg-gray-50  pt-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-16 md:gap-24">
          <div className="flex flex-col items-center text-center w-32">
            <BiSupport className="text-4xl text-primary mb-3" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-1">24/7</h3>
              <p className="text-xs text-gray-600">Support technique</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center w-32">
            <FaMoneyCheckAlt className="text-4xl text-primary mb-3" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-1">Paiement</h3>
              <p className="text-xs text-gray-600">100% Sécurisé</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center w-32">
            <AiOutlineDownload className="text-4xl text-primary mb-3" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-1 ">Download</h3>
              <p className="text-xs text-gray-600 ">Installation garantie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceFeatures
