function Modal({handleShowModal}) {
    return(
        <div className="fixed inset-0 z-40 flex items-center justify-center w-100 min-h-screen" onClick={handleShowModal}>
            <div className="fixed inset-0 bg-black opacity-35"></div>
                <div className="relative bg-white p-0 md:p-6 z-10 w-full max-w-lg">
                    <div className="relative w-full h-0 pb-[56.25%]">
                        <iframe
                        title="Video"
                        className="absolute top-0 left-0 w-full h-full"
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/TqeHDDohDqA"
                        style={{ border: 0 }}                        
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        ></iframe>
                    </div>
                </div>
    </div>
    )
}

export default Modal;