class Node:
  """Represents a node in the trie """

  def __init__(self, key, depth=0):
    """Key is a single letter for the node. """
    self.key = key # key
    self.content = [] # stores a list of all the usernames that can be built off of this node
    self.children = {} # key: letter, value: node
    self.depth = depth

  def add_child(self, key):
    self.children[key] = Node(key=key, depth=self.depth+1)

  def add_content(self, word):
    self.content.append(word)
    
  def __repr__(self):
    return f'<Node(key={self.key}, content={self.content})>'

class AutoCompleteTrie:
  """ A trie to be built for a word """

  def __init__(self):
    self.root = Node('')

  def add_to_trie(self, word):
    """ Adds a word to all the correct nodes in """

    curr = self.root
    for letter in word:
      if letter not in curr.children:
        curr.add_child(letter)
      curr.add_content(word)
      curr = curr.children[letter]
    curr.add_content(word)
    

  def add_words_to_trie(self, array_words):
    [self.add_to_trie(word) for word in array_words]
      
  def display(self):
    """Displays the tree in a nice way """

    # This is a shitty queue that pops from the front, but its ok for now 
    queue = []
    queue.append(self.root)

    while queue:
      curr = queue.pop(0)
      print('-' * curr.depth, end="")
      print(f'key: {curr.key} content: {curr.content} \n')
      for k,v in curr.children.items():
        queue.append(v)

  def autocomplete(self, word):
    
    curr = self.root
    for letter in word:
      if letter not in curr.children:
        return []
      else:
        curr = curr.children[letter]
    
    return curr.content



if __name__ == "__main__":

  names = ['orlando', 'oreo', 'olivia', 'oliver', 'orangutan', 'austin', 'jason', 'jacques']

  tri = AutoCompleteTrie()

  tri.add_words_to_trie(names)
  print(tri.autocomplete("jaso"))
  
  

  