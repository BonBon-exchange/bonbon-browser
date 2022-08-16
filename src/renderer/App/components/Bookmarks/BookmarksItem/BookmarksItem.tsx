/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { Chip, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';

import { Tag } from 'types/bookmarks';

import { BookmarksItemProps } from './Types';

export const BookmarksItem: React.FC<BookmarksItemProps> = ({
  bookmark,
  handleDelete,
  handleClick,
  replaceItem,
}: BookmarksItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(bookmark.name);
  const [url, setUrl] = useState<string>(bookmark.url);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsOption, setTagsOptions] = useState<Tag[]>([]);

  const handleEditBookmark = () => setIsEditing(true);
  const handleSaveBookmark = () => {
    const formattedBookmark = {
      id: bookmark.id,
      name,
      url,
      host: bookmark.host,
      domain: bookmark.domain,
      tags: tags.map((tg) => (tg.inputValue ? tg.inputValue : tg.tag)),
    };
    window.app.bookmark
      .editBookmark(formattedBookmark)
      .then((b) => {
        setIsEditing(false);
        replaceItem(b);
      })
      .catch(console.log);
  };

  const filter = createFilterOptions<Tag>();

  useEffect(() => {
    window.app.bookmark
      .getBookmarksTags()
      .then((val) => {
        setTagsOptions(val);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (bookmark.tags)
      setTags(
        bookmark.tags?.map((tg) => ({
          tag: tg,
        }))
      );
  }, [bookmark.tags]);

  return isEditing ? (
    <div className="Bookmarks__item" key={bookmark.id}>
      <div className="Bookmarks__item-text">
        <div className="Bookmarks__item-name">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </div>
        <div className="Bookmarks__item-url">
          <TextField
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />
        </div>
        <div className="Bookmarks__item-tags">
          <Autocomplete
            multiple
            value={tags}
            onChange={(_event, newValue: any) => {
              if (typeof newValue === 'string') {
                setTags([
                  {
                    tag: newValue,
                  },
                ]);
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setTags([
                  {
                    tag: newValue.inputValue,
                  },
                ]);
              } else {
                setTags(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue }: { inputValue: any } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.tag
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  tag: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={tagsOption}
            getOptionLabel={(option: any) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.tag;
            }}
            renderOption={(props, option) => <li {...props}>{option.tag}</li>}
            freeSolo
            renderInput={(params) => <TextField {...params} />}
            fullWidth
          />
        </div>
      </div>
      <div className="Bookmarks__item-controls">
        <div
          className="Bookmarks__item-control"
          onClick={() => handleSaveBookmark()}
        >
          <DoneIcon />
        </div>
        <div
          className="Bookmarks__item-control"
          onClick={() => setIsEditing(false)}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  ) : (
    <div className="Bookmarks__item" key={bookmark.id}>
      <div
        className="Bookmarks__item-text"
        onClick={() => handleClick(bookmark.url)}
      >
        <div className="Bookmarks__item-name">{bookmark.name}</div>
        <div className="Bookmarks__item-url">{bookmark.url}</div>
        <div className="Bookmarks__item-tags">
          {bookmark.tags?.map((tag: string) => (
            <Chip label={tag} />
          ))}
        </div>
      </div>
      <div className="Bookmarks__item-controls">
        <div
          className="Bookmarks__item-control"
          onClick={() => handleEditBookmark()}
        >
          <EditIcon />
        </div>
        <div
          className="Bookmarks__item-control"
          onClick={() => handleDelete(bookmark.id)}
        >
          <DeleteForeverIcon />
        </div>
      </div>
    </div>
  );
};
