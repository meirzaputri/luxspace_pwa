import ArrivedItem from './ArrivedItem.js'
function Arrived({ items }) {
    return(
        <section className="flex flex-col py-16">
      <div className="container mx-auto mb-4">
        <div className="flex justify-center text-center mb-4">
          <h3 className="text-2xl capitalize font-semibold">
            Just Arrived <br/>
            <span className='text-[#f472b6]'>this summer for you</span>
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto px-4" id="carousel">
        <div className="container mx-auto"></div>
        {/* <!-- <div className="overflow-hidden z-10"> --> */}
        <div className="flex -mx-4 flex-row relative">

        {console.log("Items sebelum map:", items)}
          {/* iterasi card berdasarkan item */}
          {items && items.map(function (item){
            return(
              <ArrivedItem item={item} key={item.id}/>
            )
          })}
        </div>
      </div>
    </section>
    )
}

export default Arrived;