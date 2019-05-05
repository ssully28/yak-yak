from queue import Queue

class Node:
  """Represents a node in the trie """

  def __init__(self, char, depth=0):
    """char is a single letter for the node. """
    self.char = char 
    self.list_words = [] # List of all words that contain that prefix
    self.children = {} # key: char, value: child node
    self.depth = depth

  def add_child(self, char):
    """Adds a child node with the given character """
    self.children[char] = Node(char=char, depth=self.depth+1)

  def add_word(self, word):
    """Adds a single word to the list of words of that node. """
    self.list_words.append(word)
    
  def __repr__(self):
    return f'<Node(key={self.char}, list_words={self.children})>'

class AutoCompleteTrie:
  """A trie to be built for a word """

  def __init__(self):
    self.root = Node('')

  def add_word_to_trie(self, word):
    """Adds a word to all the correct nodes in """

    curr = self.root

    # Traverse the tree, dumping the word in every node along its path.
    for letter in word:
      if letter not in curr.children:
        curr.add_child(letter)
      curr.add_word(word)
      curr = curr.children[letter]
    curr.add_word(word)
    
  def add_words_to_trie(self, array_words):
    [self.add_word_to_trie(word) for word in array_words]
      
  def display(self):
    """Displays the tree, BFS """

    queue = Queue()
    queue.put(self.root)

    while queue:
      curr = queue.get()
      print(' ' * curr.depth, end="") # Indentation to be used to indicate depth
      print(f'char: {curr.char} children: {curr.children} \n')
      for k, v in curr.children.items():
        queue.put(v)

  def autocomplete(self, prefix):
    """Traverses the trie and returns the list of words that contain that prefix """
    
    curr = self.root
    # Traverse to the terminal node
    for letter in prefix:
      if letter not in curr.children: # There are no users with the prefix
        return []
      else:
        curr = curr.children[letter]
    
    return curr.list_words



if __name__ == "__main__":

  names = ['orlando', 'oreo', 'olivia', 'oliver', 'orangutan', 'austin', 'jason', 'jacques']

  tri = AutoCompleteTrie()

  tri.add_words_to_trie(names)
  print(tri.autocomplete("j"))
  
  

  