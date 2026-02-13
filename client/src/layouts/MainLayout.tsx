import Header from "../components/Header";


function MainLayout ({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />  
            <div className="container">
                {children}
            </div>
            
        </>
    )
}

export default MainLayout