import { Link } from "react-router-dom";
import AsideMenu from "../components/AsideMenu";
import Footer from "../components/Footer";
import Header from "../components/Header";
function Success() {
  return (
    <>
      <Header />

      {/* <!-- START: BREADCRUMB --> */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <ul className="breadcrumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link
                to="/success"
                aria-label="current-page"
                className="text-[#f472b6]"
              >
                Success
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- END: BREADCRUMB --> */}

      {/* <!-- START: CONGRATS --> */}
      <section className="">
        <div className="container mx-auto min-h-screen">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full md:w-4/12 text-center">
              <img
                src="./images/content/illustration-success.png"
                alt="congrats illustration"
              />
              <h2 className="text-3xl font-semibold mb-6">
                Ah yes it’s success!
              </h2>
              <p className="text-lg mb-12">
                Produk yang anda beli akan kami kirimkan saat ini juga, so now
                please sit tight and be ready for it
              </p>
              <Link
                to="/"
                className="text-gray-900 bg-red-200 focus:outline-none w-full py-3 rounded-full text-lg focus:text-black transition-all duration-200 px-8 cursor-pointer"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- END: CONGRATS --> */}

      <AsideMenu />
      <Footer />
    </>
  );
}

export default Success;
