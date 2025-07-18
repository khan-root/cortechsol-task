import { FaExpeditedssl, FaTrash } from "react-icons/fa6"

const Dashboard = () => {
  return (
    <div className="h-fit w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[{key: 1, title: "Todo"}, {key: 2, title: "In Progress"}, {key: 3, title: "Done"}].map((item, index)=>{
        return (
          <div key={index} className="bg-white p-3 space-y-2 rounded-lg shadow-2xl">
            <div className="flex justify-between items-center ">
              <span>{item.title}</span>
              
            </div>
            {[1,2,3].map((item, index)=>{
              return (
                <div key={index} className="border border-black w-full flex justify-center items-center py-1 px-2">
                  <div className="w-full h-full flex justify-between items-center border border-black">
                    <div className="flex-1">
                      Title
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        <FaExpeditedssl />
                      </span>
                      <span>
                        <FaTrash />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard