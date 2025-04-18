function Browse() {
  return (
    <section className="flex bg-pink-400 py-16 px-4" id="browse-the-room">
      <div className="container mx-auto">
        <div className="flex flex-start mb-4">
          <h3 className="text-2xl capitalize font-semibold">
            browse collections <br className="" />
            made just for you
          </h3>
        </div>
        <div className="grid grid-rows-2 grid-cols-9 gap-4">
          <div
            className="relative col-span-9 row-span-1 md:col-span-4 card"
            style={{ height: "180px" }}
          >
            <div className="card-shadow rounded-xl">
              <img
                src="./images/content/image-catalog-7.jpg"
                alt=""
                className="w-full h-full object-cover object-center overlay overflow-hidden rounded-xl"
              />
            </div>
            <div className="overlay left-0 top-0 bottom-0 flex justify-center flex-col pl-48 md:pl-72">
              <h5 className="text-lg font-semibold">Jewelery</h5>
              <span className="">18.309 items</span>
            </div>
            <a href="details.html" className="stretched-link">
              {/* <!-- fake children --> */}
            </a>
          </div>
          <div className="relative col-span-9 row-span-1 md:col-span-2 md:row-span-2 card">
            <div className="card-shadow rounded-xl">
              <img
                src="./images/content/image-catalog-10.jpg"
                alt=""
                className="w-full h-full object-cover object-center overlay overflow-hidden rounded-xl"
              />
            </div>
            <div className="overlay right-0 left-0 top-0 bottom-0 md:bottom-auto flex justify-center md:items-center flex-col pl-48 md:pl-0 pt-0 md:pt-12">
              <h5 className="text-lg font-semibold">Men's Clothing</h5>
              <span className="">77.392 items</span>
            </div>
            <a href="details.html" className="stretched-link">
              {/* <!-- fake children --> */}
            </a>
          </div>
          <div className="relative col-span-9 row-span-1 md:col-span-3 md:row-span-2 card">
            <div className="card-shadow rounded-xl">
              <img
                src="./images/content/image-catalog-9.jpg"
                alt=""
                className="w-full h-full object-cover object-center overlay overflow-hidden rounded-xl"
              />
            </div>
            <div className="overlay right-0 left-0 top-0 bottom-0 md:bottom-auto flex justify-center md:items-center flex-col pl-48 md:pl-0 pt-0 md:pt-12">
              <h5 className="text-lg font-semibold">Women's Clothing</h5>
              <span className="">22.094 items</span>
            </div>
            <a href="details.html" className="stretched-link">
              {/* <!-- fake children --> */}
            </a>
          </div>
          <div className="relative col-span-9 row-span-1 md:col-span-4 card">
            <div className="card-shadow rounded-xl">
              <img
                src="./images/content/image-catalog-11.jpg"
                alt=""
                className="w-full h-full object-cover object-center overlay overflow-hidden rounded-xl"
              />
            </div>
            <div className="overlay left-0 top-0 bottom-0 flex justify-center flex-col pl-48 md:pl-72">
              <h5 className="text-lg font-semibold">Electronics</h5>
              <span className="">837 items</span>
            </div>
            <a href="details.html" className="stretched-link">
              {/* <!-- fake children --> */}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Browse;
