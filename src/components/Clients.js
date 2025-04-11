function Clients() {
    return(
      <>

  <div className="relative w-full py-16">
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f9cada' fill-opacity='0.23' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
      </div>
    <section className="relative container mx-auto z-10">  
      <div className="flex justify-center items-center flex-wrap">
        <div
          className="w-full flex-auto md:w-auto md:flex-initial px-4 md:px-6 my-4 md:my-0"
        >
          <img src="./images/content/logo-gucci.svg" alt="gucci" className="mx-auto max-w-[150px]" />
        </div>
        <div
          className="w-full flex-auto md:w-auto md:flex-initial px-4 md:px-6 my-4 md:my-0"
        >
          <img src="./images/content/logo-burberry.svg" alt="burberry" className="mx-auto  max-w-[150px]" />
        </div>
        <div
          className="w-full flex-auto md:w-auto md:flex-initial px-4 md:px-6 my-4 md:my-0"
        >
          <img
            src="./images/content/logo-chanel.svg"
            alt="chanel"
            className="mx-auto max-w-[150px]"
          />
        </div>
        <div
          className="w-full flex-auto md:w-auto md:flex-initial px-4 md:px-6 my-4 md:my-0"
        >
          <img src="./images/content/logo-tiffanyco.svg" alt="tiffanyco" className="mx-auto max-w-[155px]" />
        </div>
      </div>
    </section>
  </div>
    </>
    )
}

export default Clients;