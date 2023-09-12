import "./home.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "./book/book";
import { Spin, Pagination, Carousel, Select } from "antd";

import Poster from "./poster";

function Home() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [genre, setGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All gerne");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_PORT}/getgenre`)
      .then((res) => {
        setGenre(res.data);
        console.log("genre", genre);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleGenreChange = (value) => {
    console.log(`selected ${value}`);
    setSelectedGenre(value);



    console.log(`selected ${value}`);
    axios

      .post(`${process.env.REACT_APP_API_PORT}/getbookbygenre`, {
        genre: value,
      })
      .then((res) => {
        setProducts(res.data);
        console.log("genre", genre);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const fetchProducts = () => {
    
    const url = `${process.env.REACT_APP_API_PORT}/getallbooks?page=${currentPage}&pageSize=${pageSize}`;
    axios
      .get(url)
      .then((response) => {
        setProducts(response.data.books);
        setTotalPages(response.data.totalPages);

        // Generate an array of page numbers [1, 2, 3, ..., totalPages]
        setPageNumbers(
          Array.from({ length: response.data.totalPages }, (_, i) => i + 1)
        );
      })
      .catch((error) => console.log(error));
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
  
    // Gọi API để lấy sản phẩm với bộ lọc giá
    axios
      .get(`${process.env.REACT_APP_API_PORT}/books/price/${value}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="home">
        <Carousel id="carousels" autoplay>
          <div>
            <Poster src={"./img/poster1.png"} />
          </div>
          <div>
            <Poster src={"./img/poster2.png"} />
          </div>
          <div>
            <Poster src={"./img/poster3.png"} />
          </div>
        </Carousel>
        <div className="horizontal-line"></div>

        <div className="filter-container">
          <Select
            mode="single"
            placeholder="Select a genre"
            className="filter"
            options={[
              { value: "all", label: "All" },
              ...[...new Set(genre)].map((item) => ({
                value: item,
                label: item,
              })),
            ]}
            value={selectedGenre}
            onChange={handleGenreChange}
            allowClear={true}
          />

          <Select
            mode="single"
            placeholder="Select a price range"
            className="filter" // Thêm lớp .filter để căn giữa ngang
            options={[
              { value: "all", label: "All Prices" },
              { value: "under10", label: "Under $10" },
              { value: "10to20", label: "$10 - $20" },
              { value: "over20", label: "Over $20" },
            ]}
            value={priceFilter}
            onChange={handlePriceFilterChange}
            allowClear={true}
          />
        </div>

        <div className="home-container_5 con">
          {products.map(
            ({
              ID,
              Image,
              Tittle,
              Author,
              Rating,
              Price,
              Description,
              _id,
            }) => (
              <Book
                key={ID}
                id={ID}
                image={Image}
                title={Tittle}
                author={Author}
                price={Price}
                rate={Rating}
                description={Description}
                _id={_id}
              />
            )
          )}
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalPages * pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
