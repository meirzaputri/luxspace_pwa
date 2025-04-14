import logo from "../images/content/pikabuy.png";
function Splash() {
  return (
    <section>
      <div className="container mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-full md:w-4/12 text-center">
            <img
              src={logo}
              alt="PikaBuy | Find It. Love It. Buy It."
              className="mx-auto mb-8"
            />
            <p className="mb-16 px-4">
              We offer a curated selection of fashion, jewelry, and electronics
              to match your style and needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Splash;
