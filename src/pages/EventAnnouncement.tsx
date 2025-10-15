import Marquee from "react-fast-marquee";
import { MarqueeContent, MarqueeItem } from "~/components/ui/shadcn-io/marquee";
import { api } from "~/utils/api"

export default function EventAnnoucement() {
  const event = api.event.get.useQuery();

  if (!event.data) return;

  console.log(event.data.time)
  const eventDate = new Date(event.data.time);

  return <div className="fixed flex left-0 right-0 bg-background items-center justify-center top-0 w-auto">
    <Marquee autoFill={false} loop={1} className="grow-0 flex relative">
      {new Array(10).fill(null).map((_, i: number) => {

        return <MarqueeItem className="grow-0 shrink-0 flex" key={i}>
          <span className="text-nowrap w-full font-bold animate-pulse text-xl">Movie night on {eventDate.toLocaleString()} at {event.data?.location}</span>
        </MarqueeItem>
      })}
    </Marquee>
  </div>
}
