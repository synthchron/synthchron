export const x = 1 // This is only so we can keep this file

/* 
  //Function for getting a node
  function get_node(nodeId: string) {
    return nodes.find((node) => {
      if (node.id == nodeId) {
        return node
      }
    })
  }
  
  //Test function for when edges are removed
function edgeDelTest() {
  console.log('delete')
}

//Transfer tokens on double click
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onNodeDoubleClick(params: any, node: any) {
  const fromEdges = edges.filter((edge) => edge.source == node.id)
  const toEdges = edges.filter((edge) => edge.target == node.id)

  if (node.type == 'Transition') {
    const sourceNodesIds = toEdges.map((edge) => edge.source)
    const sourceNodes = nodes.filter((fnodes) =>
      sourceNodesIds.includes(fnodes.id)
    )
    const targetNodesIds = fromEdges.map((edge) => edge.target)
    const targetNodes = nodes.filter((fnodes) =>
      targetNodesIds.includes(fnodes.id)
    )

    if (sourceNodes.every((node) => node.data.store >= 1)) {
      sourceNodes.forEach((node) => {
        node.data = { label: 'Trigg', store: node.data.store - 1 }
      })
      targetNodes.forEach((node) => {
        node.data = { label: 'ered', store: node.data.store + 1 }
      })
    }

    //For updating edges, if for example we wanted to animate edges
    //fromEdges[0].animated = true;
    //let unchangedEdges = edges.filter(edge => !fromEdges.includes(edge) && !toEdges.includes(edge))
    //let changedEdges = fromEdges.concat(toEdges);
    //setEdges(changedEdges.concat(unchangedEdges));

    const unchangedNodes = nodes.filter(
      (node) => !sourceNodes.includes(node) && !targetNodes.includes(node)
    )
    const changedNodes = sourceNodes.concat(targetNodes)
    setNodes(unchangedNodes.concat(changedNodes))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onConnect(params: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEdges((eds: Edge<any>[]) => {
    const sourceNode = get_node(params.source)
    const targetNode = get_node(params.target)

    const is_invalid = edges.every((edge) => {
      // checking if another edge already exists
      if (edge.source == params.source && edge.target == params.target)
        return true
      return false
    })

    // returning without the added note if invalid found
    if (is_invalid) {
      return eds
    }

    // Checking both nodes exists
    if (sourceNode == undefined || targetNode == undefined) return eds

    // Checking if it is valid connection for a place node
    if (sourceNode.type == 'Place') {
      if (targetNode.type == 'Place') {
        return eds
      }
    }

    // Checking if it is valid connection for a transition node
    if (sourceNode.type == 'Transition') {
      if (targetNode.type == 'Transition') {
        return eds
      }
    }

    // Add edge to the list of edges
    return addEdge(
      {
        ...params,
        type: 'Arc',
        markerEnd: { type: MarkerType.ArrowClosed },
        data: { weight: 1 },
      },
      eds
    )
  })
}
 */
