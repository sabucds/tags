import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react'
import {getWhitelistFromServer, getValue} from './mockServer'
import DragSort from '@yaireo/dragsort'
import '@yaireo/dragsort/dist/dragsort.css'

//import Tags from './tagify/react.tagify'
import Tags from '@yaireo/tagify/dist/react.tagify'

/////////////////////////////////////////////////

// Tagify settings object
const baseTagifySettings = {
  blacklist: ["xxx", "yyy", "zzz"],
  maxTags: 6,
  //backspace: "edit",
  placeholder: "type something",
  dropdown: {
    enabled: 0 // a;ways show suggestions dropdown
  }
}

// this is an example React component which implemenets Tagify within
// itself. This example is a bit elaborate, to demonstrate what's possible.
const CrazyTags = () => {
  const tagifyRef1 = useRef()
  const tagifyRefDragSort = useRef()

  // just a name I made up for allowing dynamic changes for tagify settings on this component
  const [tagifySettings, setTagifySettings] = useState([])
  const [tagifyProps, setTagifyProps] = useState({})

  // on component mount
  useEffect(() => {
    setTagifyProps({loading: true})

    getWhitelistFromServer(2000).then((response) => {
      setTagifyProps((lastProps) => ({
        ...lastProps,
        whitelist: response,
        showFilteredDropdown: "a",
        loading: false
      }))
    })

    // simulate setting tags value via server request
    getValue(3000).then((response) =>
      setTagifyProps((lastProps) => ({...lastProps, defaultValue: response}))
    )

    // simulate state change where some tags were deleted
    setTimeout(
      () =>
        setTagifyProps((lastProps) => ({
          ...lastProps,
          defaultValue: ["abc"],
          showFilteredDropdown: false
        })),
      5000
    )
  }, [])

  // merged tagify settings (static & dynamic)
  const settings = {
    ...baseTagifySettings,
    ...tagifySettings
  }

  const onChange = useCallback(e => {
    console.log("CHANGED:", e.detail.value)
  }, [])

  // access Tagify internal methods example:
  const clearAll = () => {
    tagifyRef1.current && tagifyRef1.current.removeAllTags()
  }

  // bind "DragSort" to Tagify's main element and tell
  // it that all the items with the below "selector" are "draggable".
  // This is done inside a `useMemo` hook to make sure it gets initialized
  // only when the ref updates with a value ("current")
  useMemo(() => {
    if(  tagifyRefDragSort.current )
      new DragSort(tagifyRefDragSort.current.DOM.scope, {
        selector: '.tagify__tag',
        callbacks: {
            dragEnd: onDragEnd
        }
      })
  }, [tagifyRefDragSort.current])

  // must update Tagify's value according to the re-ordered nodes in the DOM
  function onDragEnd(elm){
    tagifyRefDragSort.current.updateValueByDOMTags()
  }

  return (
    <>
      <h2>
        <em>Crazy</em> Tags:
      </h2>
      <p>
        Wait a <em>few seconds</em> to see things happen. <br />
        <small>
          <em>(Carefully examine the source-code)</em>
        </small>
      </p>
      <button className="clearAllBtn" onClick={clearAll}>
        Clear All
      </button>
      <Tags
        tagifyRef={tagifyRef1}
        settings={settings}
        defaultValue="a,b,c"
        autoFocus={true}
        {...tagifyProps}
        onChange={onChange}
        onEditInput={() => console.log("onEditInput")}
        onEditBeforeUpdate={() => console.log`onEditBeforeUpdate`}
        onEditUpdated={() => console.log("onEditUpdated")}
        onEditStart={() => console.log("onEditStart")}
        onEditKeydown={() => console.log("onEditKeydown")}
        onDropdownShow={() => console.log("onDropdownShow")}
        onDropdownHide={() => console.log("onDropdownHide")}
        onDropdownSelect={() => console.log("onDropdownSelect")}
        onDropdownScroll={() => console.log("onDropdownScroll")}
        onDropdownNoMatch={() => console.log("onDropdownNoMatch")}
        onDropdownUpdated={() => console.log("onDropdownUpdated")}
      />

      <h2>Readonly tags:</h2>
      <Tags defaultValue="foo,bar" readOnly />

      <h2>Drag & sort tags:</h2>
      <Tags 
        tagifyRef={tagifyRefDragSort}
        defaultValue="tagify, is , awesome, in so many way"/>
    </>
  )
}

export default CrazyTags
