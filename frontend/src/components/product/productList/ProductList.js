import React, { useEffect, useState } from 'react'
import "./productList.scss"
import { FaEdit,FaTrashAlt } from 'react-icons/fa'
import { AiOutlineEye } from 'react-icons/ai'
import { SpinnerImg } from '../../loader/Loader'
import Search from '../../search/Search'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice'
import ReactPaginate from "react-paginate";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { delProduct, getProducts, } from '../../../redux/features/product/productSlice'
import { Link, useNavigate } from 'react-router-dom'

const ProductList = ({products, isLoading}) => {
  const [search,setSearch] = useState("")
  
  const filteredProducts = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const shortenText = (text,n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0,n).concat("...")
      return shortenedText
    }
    return text;
  };

  const deleteProduct = async (id) => {
      await dispatch(delProduct(id))
      await dispatch(getProducts())
  }
  const confirmDelete = (id) => {
    
      confirmAlert({
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => deleteProduct(id)
          },
          {
            label: 'No',
            //onClick: () => alert('Click No')
          }
        ]
      });
  }


//begin pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

//end pagination



  useEffect(()=>{
    dispatch(FILTER_PRODUCTS({products,search}))
  },[products,search,dispatch])

  //handle double click of table row to redirect to product details
  
  
  return  <div className='product-list'>
      <hr/>
      <div className="table">
      
      <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Inventory Items</h3>
          </span>

          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)}/>
          </span>
      </div>

      {isLoading && <SpinnerImg/>}

      <div className="table">
        
        {!isLoading && products.length === 0 ? (<p>-- No product found, please add a product.</p>)
        :(
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {  
                currentItems.map((product,index) => {
                 
                 const{_id,name,category,price,quantity,} = product;
                 
                  return (
                    <tr key={_id} onDoubleClick={(e)=>navigate(`/product-details/${_id}`)}>
                      <td>{index+1}</td>
                      <td>
                        {shortenText(name,16)}
                      </td>
                      <td>
                        {category}
                      </td>
                      <td>
                        {"$"}{price}
                      </td>
                      <td>
                        {quantity}
                      </td>
                      <td>
                        {"$"}{price * quantity}
                      </td>
                      <td className='icons'>
                          <span>
                           <Link to={`/product-details/${_id}`}>
                           <AiOutlineEye size={25} color={"purple"}/>
                           </Link>
                            
                          </span>

                          <span>
                            <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={25} color={"green"}/>
                            </Link>
                            
                          </span>
                          <span>
                            <FaTrashAlt size={25} color={"red"} onClick={()=>{
                              confirmDelete(_id)
                            }}/>
                          </span>
                      </td>


                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        )}
      </div>
      <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={10}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>

    </div>

}

export default ProductList