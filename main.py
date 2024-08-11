import tkinter as tk
import customtkinter as ctk
from tkinter import colorchooser
from tkinter import filedialog
import csv
from PIL import Image, ImageTk

class dragManager():
    def add_widget(self, root, widget):
        self.widget = widget
        self.root = root
        self.widget.bind("<B1-Motion>", self.on_drag)
        self.widget.bind("<ButtonRelease>", self.on_drop)
        self.widget.configure(cursor="hand1")


    def on_drag(self, event):
        self.widget.place(x=self.root.winfo_pointerx()-self.root.winfo_rootx(), y=self.root.winfo_pointery()-self.root.winfo_rooty())

    def on_drop(self, event):
        self.widget.place(x=self.root.winfo_pointerx()-self.root.winfo_rootx(), y=self.root.winfo_pointery()-self.root.winfo_rooty())

# Create main application class
class MainGUI(ctk.CTk):

    def __init__(self):
        super().__init__()
        self.title("Animation Maker")
        self.geometry("1200x800")
        self.wm_attributes('-transparentcolor','#ff8313')
        ctk.set_default_color_theme("dark-blue.json")


        # Initialize variables
        self.original_images = {}
        self.image_copies = {}
        self.image_colors = {}
        self.image_speeds = {}
        self.image_movements = {}
        self.selected_participant = tk.StringVar(value="Participant 1")
        self.movement_var = tk.StringVar(value="Option 1")  # Default movement option

        # Setup UI components
        self.setup_ui()
    
    def setup_ui(self):
        # Configure the grid layout
        self.grid_columnconfigure(0, weight=1, minsize=200)  # Left frame (25%)
        self.grid_columnconfigure(1, weight=2, minsize=600)  # Main frame (50%)
        self.grid_columnconfigure(2, weight=1, minsize=200)  # Right frame (25%)

        self.grid_rowconfigure(0, weight=1)  # Single row to fill the height

        # Create frames
        self.left_frame = ctk.CTkFrame(self, width=200)
        self.left_frame.grid(row=0, column=0, sticky="nswe")

        self.main_frame = ctk.CTkFrame(self)
        self.main_frame.grid(row=0, column=1, sticky="nswe")

        self.right_frame = ctk.CTkFrame(self, width=200)
        self.right_frame.grid(row=0, column=2, sticky="nswe")

        # Title above the main image
        self.title_label = ctk.CTkLabel(self.main_frame, text="Animation Maker", font=("Arial", 20))
        self.title_label.pack(pady=(0, 10))

        # Dropdown Menu for participants
        self.participant_menu = ctk.CTkOptionMenu(
            self.left_frame,
            values=[f"Participant {i}" for i in range(1, 31)],
            variable=self.selected_participant
        )
        self.participant_menu.pack(pady=(10, 0), fill=tk.X, padx=20)  # Added padding and fill X

        # Main image
        self.main_image_c = tk.Canvas(self.main_frame)
        self.main_image_c.pack(expand=True, fill="both")
        self.main_image = ImageTk.PhotoImage(Image.open("../ASW-GUI/actuationmethods/jacket.png"))
        self.main_image_c.imgref = self.main_image
        self.main_image_c.create_image(0,0, image = self.main_image, anchor = tk.NW)

        # Movement options frame & title
        self.movement_frame = ctk.CTkFrame(self.main_frame)
        self.movement_frame.pack(pady=(10, 0), fill=tk.X)

        self.movement_title = ctk.CTkLabel(self.movement_frame, text="Movement", font=("Arial", 16))
        self.movement_title.pack()

        self.movement_var = tk.StringVar() # Movement: Create a StringVar to manage the selection

        # Movement options
        self.movement_options = [
            ctk.CTkRadioButton(self.movement_frame, text=f"Option {i}", variable=self.movement_var, value=f"Option {i}", command=self.on_movement_option_selected)
            for i in range(1, 5)
        ]
        for option in self.movement_options:
            option.pack(fill=tk.X, pady=2)

        self.movement_frame.pack_forget()

        # TextBox (Entry) for "Other" option
        self.other_textbox = ctk.CTkEntry(self.movement_frame, placeholder_text="Enter custom movement...")
        self.other_textbox.pack(pady=(10, 0))
        self.other_textbox.pack_forget()  # Hide by default

        # Right frame components
        self.color_wheel = ctk.CTkImage(Image.open("../ASW-GUI/actuationmethods/ColorWheel.png"), size=(150,195))

        self.color_wheel_label = ctk.CTkLabel(self.right_frame, text="Color picker", font=("Arial", 16), image=self.color_wheel)
        self.color_wheel_label.pack(pady=(10, 5))
        self.color_wheel_label.bind("<Button-1>", self.get_colorwheel_color)

        self.speed_label = ctk.CTkLabel(self.right_frame, text="Speed select", font=("Arial", 16))
        self.speed_label.pack(pady=(10, 5))

        self.speed_slider = ctk.CTkSlider(self.right_frame, from_=0, to=100)
        self.speed_slider.pack(pady=(0, 10))

        # Save button
        self.save_button = ctk.CTkButton(self.right_frame, text="Save", command=self.save_data)
        self.save_button.pack(padx=20, pady=20)

        # Load images into the left frame
        self.load_images()

        # Initially hide the right frame components
        self.hide_right_frame_components()        

    #---------IMAGE HANDLING--------
    def load_images(self):
        # Path to the directory containing images
        image_dir = "../ASW-GUI/actuationmethods/"
        
        # List of image filenames and labels
        image_files = [f"{image_dir}image{i}.png" for i in range(1, 8)]  
        image_labels = [f"Option {i}" for i in range(1, 8)]

        self.original_images = {}
        for i, (img_file, label) in enumerate(zip(image_files, image_labels)):
            try:
                # Load and convert image
                pre_img = Image.open(img_file)
                img = ctk.CTkImage(pre_img, size=(100,75))
                
                # Create image label
                img_label = ctk.CTkLabel(self.left_frame, image=img, text=label, compound=tk.BOTTOM)
                img_label.bind("<Button-1>", self.select_image)
        
                img_label.pack()
                self.original_images[img_label._label] = img_file
                print(img_label)
                self.image_colors[img_file] = "#FFFFFF"  # Default color
                self.image_speeds[img_file] = 0
                self.image_movements[img_file] = [var.cget("state") for var in self.movement_options]

            except FileNotFoundError:
                print(f"Image file not found: {img_file}")



    def create_image_copy(self, original_label, img_file):
        print(img_file)

        # Create a copy of the image
        pre_img = Image.open(img_file)
        pre_img.resize((300,300))
        img = ctk.CTkImage(pre_img)

        # Create the copy label
        img_copy_label = ctk.CTkLabel(self.main_frame, image=img, text=original_label.cget("text"), compound=tk.BOTTOM, bg_color='white')
        img_copy_label.image = img  # Keep a reference to prevent garbage collection
        #img_copy_label.place()  # Position copy at the original position
        img_copy_label.pack()
        

        #Add to drag manager
        drag = dragManager()
        drag.add_widget(self.main_frame, img_copy_label)

        # Store the copy in a dictionary
        self.image_copies[img_copy_label._label] = img_file

    def select_image(self, event):
        print("selecting image")
        img_label = event.widget
        print(img_label)

        for x in self.image_copies:
            print(x)

        for x in self.original_images:
            print(x)
        
        # Determine if the image is a copy or original
        if img_label in self.image_copies:
            print("copy")
            img_file = self.image_copies[img_label]
        elif img_label in self.original_images:
            print("orig")
            img_file = self.original_images[img_label]
        else:
            print("none")
            return
        
        # Update right frame for the selected image
        self.update_right_frame(img_file)
        print("updated right frame")
        self.create_image_copy(img_label, img_file)
        print("made copy")

        

        
    #-----RIGHT FRAME UPDATE------
    def update_right_frame(self, img_file):
        # Update color and speed based on selected image
        color = self.image_colors[img_file]
        speed = self.image_speeds[img_file]
        self.speed_slider.set(speed)
        # Show right frame components
        self.show_right_frame_components()
        # Update movement options
        for i, option in enumerate(self.movement_options):
            option.configure(state=tk.NORMAL)
            option.deselect()
        # Set the options to reflect the current state of the selected image
        for option in self.movement_options:
            if option.cget("value") in self.image_movements[img_file]:
                option.select()

    def show_right_frame_components(self):
        self.color_wheel_label.pack(pady=(10, 5))
        self.speed_label.pack(pady=(10, 5))
        self.speed_slider.pack(pady=(0, 10))
        self.movement_frame.pack()

    def hide_right_frame_components(self):
        self.color_wheel_label.pack_forget()
        self.speed_label.pack_forget()
        self.speed_slider.pack_forget()
        self.movement_frame.pack_forget()

    def on_movement_option_selected(self):
        print("move opt selected")
        selected_option = self.movement_var.get()
        if selected_option == "Option 4":  # Assuming Option 4 is "Other"
            self.other_textbox.pack(pady=(10, 0))
        else:
            self.other_textbox.pack_forget()

    def choose_color(self, event, img):
        event = event.widget
        img.getpixel(())

    def get_colorwheel_color(self, event):
        x, y = event.x, event.y
        try:
            rgb = self.img_rgb.getpixel((x, y))
            self.rgb_var.set(rgb)
        except IndexError:
            pass  # ignore errors if the cursor is outside the image

    def save_data(self):
        # Get selected participant
        participant = self.selected_participant.get()

        # Prepare data to save
        data = []

        for img_label, img_file in self.original_images.items():
            img_data = {
                "file": img_file,
                "color": self.image_colors.get(img_file, "#FFFFFF"),
                "speed": self.image_speeds.get(img_file, 0),
                "movements": self.image_movements.get(img_file, [])
            }
            data.append(img_data)

        for img_label, img_file in self.image_copies.items():
            img_data = {
                "file": img_file,
                "color": self.image_colors.get(img_file, "#FFFFFF"),
                "speed": self.image_speeds.get(img_file, 0),
                "movements": self.image_movements.get(img_file, []),
                "position": (img_label.winfo_x(), img_label.winfo_y())
            }
            data.append(img_data)

        # Save data to CSV file
        with open(f"{participant}_animation_data.csv", "w", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=["file", "color", "speed", "movements", "position"])
            writer.writeheader()
            for entry in data:
                writer.writerow(entry)

if __name__ == "__main__":
    app = MainGUI()
    app.mainloop()
