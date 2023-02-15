mod graph {

    pub struct  Graph {
        pub starting_node: Option<Node>,
        pub nodes: Vec<Node>
    }

    pub enum NodeError {
        InvalidNode(Node, String)
    }

    pub enum Node {
        Transition(usize, Vec<Node>),
        Node(Vec<Node>)
    }

    impl Graph {
        pub fn new() -> Graph {
            Graph {
                starting_node: None,
                nodes: vec![]
            }
        }

        pub fn set_starting_node(&mut self, node: Node) -> Result<(), NodeError> {

            match node {
                Node::Node(ref _transitions) => {
                    self.starting_node = Some(node)
                },
                Node::Transition(_tickets, ref _transitions) => {
                    return Err(NodeError::InvalidNode(node, "Cannot be a transition node should be a normal Node.".to_string()))
                }
            }

            return Ok(())
        }
    }


    impl Node {
        pub fn new_node() -> Node {
            Node::Node(vec![])
        }

        pub fn new_transition(tickets: usize) -> Node {
            Node::Transition(tickets, vec![])
        }

        /*pub fn add_transition(&mut self, node: &Node) -> () {
            match self {
                Node::Node(&mut transitions) => {
                    // TODO: Should add checks that it is a valid node to add?
                    transitions.append(&mut [node])
                },
                Node::Transition(_tickets, &mut  ) => {
                    // TODO: Should add checks that it is a valid node to add?
                    transitions.add(node)
                }
            }
        }*/
    }
}