import React, { useEffect, useState } from 'react'

const Products = () => {
    var [prod,setProducts]=useState([]);
    function fetchData(){
        fetch("https://fakestoreapi.com/products")
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            setProducts(data);
        })
    }

    useEffect(()=>{
        fetchData();
    },[]);

  return (
    <div>
        {prod.map((pd)=>{
            return <img src={pd.image} height={100}/>
        })}
    </div>
  )
}

export default Products