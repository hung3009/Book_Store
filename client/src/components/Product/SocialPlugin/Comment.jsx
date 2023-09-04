import React from 'react'

const Comment = (props) => {
  const {dataHref,width} = props
  return (
    <div class="fb-comments" data-href={dataHref} data-width={width} data-numposts="5"></div>
  )
}

export default Comment
