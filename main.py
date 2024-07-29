import customtkinter as tk
import tkinter.dnd as dnd
from PIL import Image
import os

def on_drag_start(event):
    widget = event.widget 
    dnd.dnd_start(widget,event)

def on_drop(event):
    target = event.widget
    source = dnd.dnd_grabbed()

    source.place(x = event.x, y = event.y)



class MainGUI(tk.CTk):

    def __init__(self):
        super().__init__()

        #Set up title and size of screen
        self.title("Jacket Design")
        self.geometry("750x750")
        tk.set_appearance_mode("light")
        #self.attributes('-fullscreen', True)
   
        self.columnconfigure(0, weight=1)
        self.rowconfigure(0, weight=1)
        
        #Adding components to the frame
        self.txt1 = OptionsFrame(self, values=["Sound","Fur","Display", "Lights", "Other"])
        self.txt1.grid(row = 0, column = 0, sticky = "nesw")






class OptionsFrame(tk.CTkFrame):
    def __init__(self, master, values):
        super().__init__(master)

        self.values = values
        self.labels = []
        self.images = []


        for i, filename in os.listdir('../ASW-GUI/actuationmethods/Display.jpg'):
            m = i * 2
            m_image = tk.CTkImage(light_image=Image.open('../ASW-GUI/actuationmethods/Display.jpg'), size=(30,30))
            image_label = tk.CTkLabel(self, image=m_image, text="")
            image_label.grid(row = m, column = 0, sticky = "w")
            self.images.append(image_label)


        for i, value in enumerate(self.values):
            m = i * 2 + 1

            text_label = tk.CTkLabel(self, corner_radius=2, text=value, pady = 10)
            text_label.grid(row = m, column = 0, sticky = "nw")
            self.labels.append(text_label)
    



app = MainGUI()
app.mainloop()