import { Input } from './ui/input'
import { Button } from './ui/button'

const Sign = () => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <div className='h-full w-[70%] md:h-[50%] md:w-[40%] flex flex-col items-center justify-center'>
        <div className="flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">Sign</h2>
        </div>
        <form className="space-y-4 w-full px-10 md:p-10">
          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Email</label>
            <Input 
              className="text-white focus:border-white focus:ring-white placeholder:text-white"
              placeholder="Enter your email"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Password</label>
            <Input 
              className="text-white focus:border-white focus:ring-white placeholder:text-white"
              placeholder="Enter your password"
              type="password"
            />
          </div>
          <div className="flex justify-end">
            <span className="text-white text-sm cursor-pointer hover:text-white/80">Don't have an account? Register</span>
          </div>
          <div className="flex justify-center">
            <Button className="bg-white text-black cursor-pointer hover:bg-white/80 hover:text-black">Sign</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Sign