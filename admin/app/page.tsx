import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Map from '@/components/Maps/MapDashboard'
import CardOverview from "@/components/OverviewCard"
import { BsBusFront } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { MdAttachMoney } from 'react-icons/md'
import {TbBusStop} from 'react-icons/tb'
import { getCount } from "@/service/analytics"

export default async function Home() {
    const data:any = await getCount()

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full gap-y-4">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        <Tabs defaultValue="overview" >
        <TabsList className="grid grid-cols-2 w-1/5 mb-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="Analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="w-full h-full flex flex-col space-y-5" >
            <div className="w-full h-[700px]">
              <Map/>
            </div>
            <div className="flex flex-row w-full h-full space-x-4">
              <CardOverview title='Buses' value={data.totalBus} description="Total number of buses in service" Icon={<BsBusFront/>}/>
              <CardOverview title='Total Stops' value={data.totalStops} description="Total number of stops in the city"  Icon={<TbBusStop/>}/>
              {/* <CardOverview title='Active' value="100" description="Total number of buses active now" Icon={<BsBusFront/>}/> */}
              <CardOverview title='Total Drivers' value={data.drivers} description="Total number of workforce" Icon={<FaUsers/>}/>
              {/* <CardOverview title='Revenue' value="Rs 150430" description="daily revenue" Icon={<MdAttachMoney/>}/> */}
            </div>
          </TabsContent>
          <TabsContent value="Analytics" className="w-full h-full flex flex-col space-y-5">
            <div>

            </div>
    </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}