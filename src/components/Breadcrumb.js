import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const item = location.state;
  return (
    <section className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <ul className="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="/" className="capitalize">
              {item?.category || "Unknown Category"}
            </a>
          </li>
          <li>
            <a href="/" aria-label="current-page" className="text-[#f472b6]">
              Details
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Breadcrumb;
