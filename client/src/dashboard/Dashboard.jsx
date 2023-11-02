import React from 'react'

export default function Dashboard() {
    return (
        <div className='px-3'>
            <div className='container-fluid'>
                <div className='row g-3 my-2'>
                    <div className='col-md-3'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>230</h3>
                                <p className='fs-5'>Products</p>
                            </div>
                            <i className='bi bi-cart-plus p-3 fs-1'></i>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>10.000.000 VNĐ</h3>
                                <p className='fs-5'>Sales</p>
                            </div>
                            <i className='bi bi-credit-card p-3 fs-1'></i>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>1.000.000 VNĐ</h3>
                                <p className='fs-5'>Rental</p>
                            </div>
                            <i className='bi bi-cash-coin p-3 fs-1'></i>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-2'>20%</h3>
                                <p className='fs-5'>Increase</p>
                            </div>
                            <i className='bi bi-graph-up-arrow p-3 fs-1'></i>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table caption-top bg-white shadow-lg border-r-4">
                <caption className='text-[#00CD00] font-semibold mt-3 fs-4'>Recent Orders</caption>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
