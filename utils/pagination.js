import {
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";

export const MyPagination = ({ pageNumber, pageCount, handleChangePage }) => {
    let items = [];
    let i = 0;
    items.push(
        <Pagination_Button toPageNumber={1} activeClass="" key={`pagination first`} handleChangePage={handleChangePage} extraClass={(pageNumber == 1) ? "disabled" : ""}>
            <i className="fas fa-angle-left" />
            <span className="sr-only">First</span>
        </Pagination_Button>
    )
    items.push(
        <Pagination_Button toPageNumber={(pageNumber > 2) ? (pageNumber - 1) : 1} activeClass="" key={`pagination prev`} handleChangePage={handleChangePage} extraClass={(pageNumber == 1) ? "disabled" : ""}>
            <i className="fas fa-angle-left" />
            <span className="sr-only">Previous</span>
        </Pagination_Button >
    );
    // console.log('----------------1:', i);
    let startNumber = (pageNumber <= 6) ? 1 : (pageNumber - 5);
    let EndNumber = (pageCount <= (pageNumber + 5)) ? pageCount : (pageNumber + 5);
    for (i = startNumber; i < pageNumber; i++) {
        items.push(
            <Pagination_Button toPageNumber={i} activeClass="" key={`pagination ${i}`} handleChangePage={handleChangePage}>
                {i}
            </Pagination_Button>
        );
    }
    // console.log('----------------2:', i);
    items.push(
        <Pagination_Button toPageNumber={i} activeClass="active" key={`pagination current`} handleChangePage={handleChangePage}>
            {i}
        </Pagination_Button>
    );
    for (i = (pageNumber + 1); i <= EndNumber; i++) {
        items.push(
            <Pagination_Button toPageNumber={i} activeClass="" key={`pagination ${i}`} handleChangePage={handleChangePage}>
                {i}
            </Pagination_Button>
        );
    }
    items.push(
        <Pagination_Button toPageNumber={(pageNumber < pageCount) ? (pageNumber + 1) : pageCount} activeClass="" key={`pagination next`} handleChangePage={handleChangePage} extraClass={(pageNumber == pageCount) ? "disabled" : ""}>
            <i className="fas fa-angle-right" />
            <span className="sr-only">Next</span>
        </Pagination_Button>
    )
    items.push(
        <Pagination_Button toPageNumber={pageCount} activeClass="" key={`pagination last`} handleChangePage={handleChangePage} extraClass={(pageNumber == pageCount) ? "disabled" : ""}>
            <i className="fas fa-angle-right" />
            <span className="sr-only">Last</span>
        </Pagination_Button >
    );

    return (
        <>
            <nav aria-label="...">
                <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                >
                    {items}
                </Pagination>
            </nav>
        </>
    );
}

const Pagination_Button = ({ toPageNumber, children, activeClass, handleChangePage, extraClass = "" }) => {
    return (
        <PaginationItem className={`${extraClass} ${activeClass}`}>
            <PaginationLink href="#pablo" onClick={() => { handleChangePage(toPageNumber) }} tabIndex="-1" >
                {children}
            </PaginationLink>
        </PaginationItem>
    );
}
