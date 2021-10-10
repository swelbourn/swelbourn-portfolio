import React, { useState } from "react"

import { mod } from "../../libs/mod"

import { ImageModal } from "../ImageModal/ImageModal.component"

import "./ScreenshotCarousel.styles.scss"

export const ScreenshotCarousel = ({ screenshots }) => {
  const [displayArr, setDisplayArr] = useState([0, 1, 2])
  const [loaded, setLoaded] = useState(true)
  const [modalActive, setModalActive] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const scrollCarousel = n => {
    setLoaded(false)
    const updatedDisplay = displayArr.map(i => {
      return i + n
    })

    setTimeout(() => {
      setDisplayArr(updatedDisplay)
      setLoaded(true)
    }, 250)
  }

  const openModal = url => {
    setModalIndex(url)
    setModalActive(true)
  }

  const closeModal = () => {
    setModalActive(false)
  }

  const scrollModal = n => {
    let updatedModalIndex = modalIndex + n

    //handle looping screenshot array
    if (updatedModalIndex < 0) {
      updatedModalIndex = screenshots.length - 1
    } else if (updatedModalIndex > screenshots.length - 1) {
      updatedModalIndex = 0
    }

    setModalIndex(updatedModalIndex)
  }

  return (
    <div className="screenshot-carousel">
      <ImageModal
        modalActive={modalActive}
        modalIndex={modalIndex}
        imageList={screenshots}
        scrollModal={scrollModal}
        closeModal={closeModal}
      />
      <button
        className="carousel-arrow-left"
        type="button"
        onClick={() => scrollCarousel(-1)}
      />
      <span className={`carousel-content ${loaded ? "loaded" : ""}`}>
        {displayArr.map(el => {
          const imageIndex = mod(el, screenshots.length)

          return (
            <figure onClick={() => openModal(imageIndex)}>
              <div
                className="carousel-image"
                style={{
                  backgroundImage: `url(${screenshots[imageIndex].screenshot})`,
                }}
              />
            </figure>
          )
        })}
      </span>
      <button
        className="carousel-arrow-right"
        type="button"
        onClick={() => scrollCarousel(1)}
      />
    </div>
  )
}
